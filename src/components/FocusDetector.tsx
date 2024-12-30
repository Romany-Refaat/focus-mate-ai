import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface FocusDetectorProps {
  onFocusChange: (isFocused: boolean) => void;
}

export const FocusDetector = ({ onFocusChange }: FocusDetectorProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await blazeface.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startVideo();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isEnabled]);

  useEffect(() => {
    if (!model || !isEnabled || !videoRef.current) return;

    let animationFrame: number;
    const detectFace = async () => {
      if (!videoRef.current) return;
      
      const predictions = await model.estimateFaces(videoRef.current, false);
      const isFocused = predictions.length > 0;
      onFocusChange(isFocused);
      
      animationFrame = requestAnimationFrame(detectFace);
    };

    if (videoRef.current.readyState === 4) {
      detectFace();
    } else {
      videoRef.current.onloadeddata = detectFace;
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [model, isEnabled, onFocusChange]);

  return (
    <div className="w-full max-w-lg space-y-4 bg-card rounded-lg p-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="camera-mode">Camera</Label>
        <Switch
          id="camera-mode"
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        Don't worry! No data is collected, we use camera to ensure the points system stays clean!
      </p>
      {isEnabled && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full aspect-video rounded-lg object-cover"
        />
      )}
    </div>
  );
};