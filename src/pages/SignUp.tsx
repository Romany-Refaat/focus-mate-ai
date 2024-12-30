import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    if (isSubmitting) {
      toast.error("Please wait before trying again");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('rate_limit')) {
          toast.error("Please wait a moment before trying again");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Account created successfully");
      navigate("/signin");
    } catch (error: any) {
      toast.error(error.message || "Error creating account");
    } finally {
      // Reset submission state after 30 seconds
      setTimeout(() => setIsSubmitting(false), 30000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Create Account</h2>
          <p className="mt-2 text-muted-foreground">Sign up for MainFocus</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : "Sign Up"}
          </Button>

          <p className="text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;