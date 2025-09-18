import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, Check, X, AlertTriangle, ArrowLeft, Mail, Phone, MessageCircle } from "lucide-react";

const hashPin = (pin) => {
  try {
    return btoa(`techtalke_pin:${pin}`);
  } catch (e) {
    return pin;
  }
};

const PinInput = ({ value, onChange, placeholder, showValue, onToggleShow }) => {
  return (
    <div className="relative group">
      <Input
        type={showValue ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-14 text-center text-2xl font-bold tracking-[0.5em] pl-6 pr-14 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
      >
        {showValue ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      {value && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < value.length ? 'bg-green-400 scale-110' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ContactAdminPage = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-white/10 mb-6">
            <Lock className="w-10 h-10 text-orange-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">PIN Recovery</h2>
          <p className="text-white/60">Need help with your PIN? Contact our support team</p>
        </div>

        <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="space-y-6">
            {/* Info message */}
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-orange-200 text-sm font-medium mb-1">PIN Reset Required</p>
                  <p className="text-orange-300/80 text-xs">
                    For security reasons, PIN recovery requires administrator verification. Please contact our support team using any of the methods below.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Contact Support</h3>
              
              <div className="grid gap-3">
                {/* Email */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Email Support</p>
                      <p className="text-white/60 text-sm">support@techtalke.com</p>
                    </div>
                    <div className="text-white/40 text-xs">
                      24-48 hrs
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <Phone className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Phone Support</p>
                      <p className="text-white/60 text-sm">+1 (555) 123-4567</p>
                    </div>
                    <div className="text-white/40 text-xs">
                      Mon-Fri 9-5
                    </div>
                  </div>
                </div>

                {/* Live Chat */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <MessageCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Live Chat</p>
                      <p className="text-white/60 text-sm">Available on our website</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">Online</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What to include */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-white font-medium mb-3">Please include in your message:</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Your account email address
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Account verification details
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  Reason for PIN reset request
                </li>
              </ul>
            </div>

            {/* Back button */}
            <Button
              onClick={onBack}
              variant="ghost"
              className="w-full h-12 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to PIN Entry
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-white/40">
            Your security is our priority. PIN resets are processed securely by our admin team.
          </p>
        </div>
      </div>
    </div>
  );
};

const PinVerify = ({ onFinish, userInfo }) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);
  const [showForgotPage, setShowForgotPage] = useState(false);
  
  const userId = userInfo?._id || userInfo?.id;
  const pinKey = userId ? `techtalke_pin_${userId}` : null;
  const maxAttempts = 3;

  const handleVerify = () => {
    if (!pinKey) {
      toast.error("Missing user context");
      return;
    }
    const stored = localStorage.getItem(pinKey);
    if (!stored) {
      toast.error("No PIN found for this account. Please set a PIN.");
      return;
    }
    if (!/^[0-9]{4}$/.test(pin)) {
      toast.error("Enter 4 digits");
      return;
    }
    setLoading(true);
    try {
      const hashed = hashPin(pin);
      if (hashed === stored) {
        const verifiedKey = `techtalke_pin_verified_${userId}`;
        sessionStorage.setItem(verifiedKey, "true");
        toast.success("Verified");
        onFinish && onFinish();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        toast.error("Incorrect PIN");
        setPin("");
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => {
    setShowForgotPage(true);
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setPin(value);
    if (value.length === 4 && !loading) {
      setTimeout(() => handleVerify(), 300);
    }
  };

  // Show contact page if forgot PIN is clicked
  if (showForgotPage) {
    return <ContactAdminPage onBack={() => setShowForgotPage(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-white/10 mb-6 transition-all duration-300 ${
            attempts >= maxAttempts ? 'from-red-500/20 to-orange-500/20' : ''
          }`}>
            {attempts >= maxAttempts ? (
              <AlertTriangle className="w-10 h-10 text-red-400" />
            ) : (
              <Lock className="w-10 h-10 text-green-400" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/60">Enter the PIN you set earlier to continue.</p>
        </div>

        <div className={`p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 ${
          shake ? 'animate-pulse border-red-400/50' : ''
        }`}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3 text-center">
                Enter your 4-digit PIN
              </label>
              <div className={shake ? 'animate-bounce' : ''}>
                <PinInput
                  value={pin}
                  onChange={handlePinChange}
                  placeholder="••••"
                  showValue={showPin}
                  onToggleShow={() => setShowPin(!showPin)}
                />
              </div>
              {attempts > 0 && attempts < maxAttempts && (
                <div className="flex items-center justify-center gap-2 mt-3 text-orange-400 text-sm animate-in slide-in-from-bottom duration-300">
                  <X size={16} />
                  {maxAttempts - attempts} attempts remaining
                </div>
              )}
              {attempts >= maxAttempts && (
                <div className="flex items-center justify-center gap-2 mt-3 text-red-400 text-sm animate-in slide-in-from-bottom duration-300">
                  <AlertTriangle size={16} />
                  Maximum attempts reached
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleVerify}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                disabled={loading || pin.length !== 4 || attempts >= maxAttempts}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    Verify
                  </div>
                )}
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleForgot}
                className="px-4 h-12 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                disabled={loading}
              >
                Forgot
              </Button>
            </div>

            {/* Security indicator */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="flex gap-1">
                {Array.from({ length: maxAttempts }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < attempts ? 'bg-red-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-white/40">
                Your data is protected with secure authentication
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinVerify;