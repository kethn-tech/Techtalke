import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Shield, Eye, EyeOff, Check, X } from "lucide-react";

// Simple client-side hash (not meant as strong cryptography). Uses btoa for light obfuscation.
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
        className="h-14 text-center text-2xl font-bold tracking-[0.5em] pl-6 pr-14 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
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
                i < value.length ? 'bg-blue-400 scale-110' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PinSetup = ({ onFinish, userInfo }) => {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);

  const userId = userInfo?._id || userInfo?.id;
  const pinKey = userId ? `techtalke_pin_${userId}` : null;

  const pinValid = /^[0-9]{4}$/.test(pin);
  const pinsMatch = pin === confirm && confirm.length === 4;

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setPin(value);
    if (value.length === 4 && step === 1) {
      setTimeout(() => setStep(2), 300);
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setConfirm(value);
  };

  const handleSave = () => {
    if (!/^[0-9]{4}$/.test(pin)) {
      toast.error("PIN must be 4 digits");
      return;
    }
    if (pin !== confirm) {
      toast.error("PINs do not match");
      return;
    }
    if (!pinKey) {
      toast.error("Unable to save PIN - missing user context");
      return;
    }
    setLoading(true);
    try {
      const hashed = hashPin(pin);
      localStorage.setItem(pinKey, hashed);
      // mark session as verified so user isn't asked again this session
      const verifiedKey = `techtalke_pin_verified_${userId}`;
      sessionStorage.setItem(verifiedKey, "true");
      toast.success("PIN saved");
      onFinish && onFinish();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 mb-6">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Secure Your Account</h2>
          <p className="text-white/60">Create a 4-digit PIN for quick access</p>
        </div>

        <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= 1 ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'
              }`}>
                {pinValid ? <Check size={16} /> : '1'}
              </div>
              <div className={`w-12 h-0.5 transition-all duration-300 ${
                step >= 2 ? 'bg-blue-500' : 'bg-white/10'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                step >= 2 ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/40'
              }`}>
                {pinsMatch ? <Check size={16} /> : '2'}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100' : 'opacity-50'}`}>
              <label className="block text-sm font-medium text-white/80 mb-3">
                {step === 1 ? "Enter your PIN" : "Your PIN"}
              </label>
              <PinInput
                value={pin}
                onChange={handlePinChange}
                placeholder="••••"
                showValue={showPin}
                onToggleShow={() => setShowPin(!showPin)}
              />
              {pinValid && (
                <div className="flex items-center gap-2 mt-2 text-green-400 text-sm">
                  <Check size={16} />
                  PIN format is valid
                </div>
              )}
            </div>

            {step >= 2 && (
              <div className="animate-in slide-in-from-bottom duration-500">
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Confirm your PIN
                </label>
                <PinInput
                  value={confirm}
                  onChange={handleConfirmChange}
                  placeholder="••••"
                  showValue={showConfirm}
                  onToggleShow={() => setShowConfirm(!showConfirm)}
                />
                {confirm.length === 4 && (
                  <div className={`flex items-center gap-2 mt-2 text-sm ${
                    pinsMatch ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {pinsMatch ? <Check size={16} /> : <X size={16} />}
                    {pinsMatch ? 'PINs match!' : 'PINs do not match'}
                  </div>
                )}
              </div>
            )}

            {step >= 2 && (
              <div className="animate-in slide-in-from-bottom duration-700 delay-200">
                <Button
                  onClick={handleSave}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={loading || !pinsMatch}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Setting up...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock size={20} />
                      Save PIN
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-white/40">
              This PIN will be required each time you open the app this session for quick verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinSetup;