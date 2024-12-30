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
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="camera-mode"
          checked={isEnabled}
          onCheckedChange={setIsEnabled}
        />
        <Label htmlFor="camera-mode">Camera Focus Detection</Label>
      </div>
      {isEnabled && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-64 h-48 rounded-lg object-cover"
        />
      )}
    </div>
  );
};