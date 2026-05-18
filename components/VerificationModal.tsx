import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => Promise<void>;
};

export default function VerificationModal({
  visible,
  email,
  onClose,
  onVerify,
  onResend,
}: Props) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (visible) {
      setCode(["", "", "", "", "", ""]);
      setIsSuccess(false);
      setIsVerifying(false);
      setIsResending(false);
      setError("");
      setResendCooldown(0);
      setTimeout(() => inputs.current[0]?.focus(), 200);
    }
  }, [visible]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  async function handleChange(text: string, index: number) {
    if (isVerifying) return;
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setError("");

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "") && digit) {
      const fullCode = next.join("");
      setIsVerifying(true);
      const ok = await onVerify(fullCode);
      setIsVerifying(false);
      if (ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          router.replace("/");
        }, 1000);
      } else {
        setCode(["", "", "", "", "", ""]);
        setError("Invalid code. Please try again.");
        setTimeout(() => inputs.current[0]?.focus(), 100);
      }
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.avoidingView}
        >
          <View className="bg-background rounded-t-[28px] px-6 pt-8 pb-10">
            {/* Handle bar */}
            <View className="w-10 h-1 bg-border rounded-full self-center mb-6" />

            <Text className="text-[22px] font-[Poppins-Bold] text-text-primary mb-2">
              {isSuccess ? "All verified! 🎉" : "Check your email"}
            </Text>
            <Text className="body-medium text-text-secondary mb-8">
              {isSuccess ? (
                "Taking you in..."
              ) : (
                <>
                  We sent a 6-digit code to{" "}
                  <Text className="font-[Poppins-SemiBold] text-text-primary">
                    {email}
                  </Text>
                </>
              )}
            </Text>

            {/* Code inputs */}
            <View className="flex-row justify-between mb-4">
              {code.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  value={digit}
                  onChangeText={(t) => handleChange(t, i)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, i)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[
                    styles.codeBox,
                    digit ? styles.codeBoxFilled : undefined,
                    isSuccess ? styles.codeBoxSuccess : undefined,
                  ]}
                />
              ))}
            </View>

            {error ? (
              <Text className="text-[12px] font-[Poppins-Medium] text-error text-center mb-4">
                {error}
              </Text>
            ) : null}

            {/* Resend link */}
            <View className="flex-row justify-center mb-8">
              <Text className="body-medium text-text-secondary">
                Didn&apos;t receive it?{" "}
              </Text>
              {resendCooldown > 0 ? (
                <Text className="body-medium text-text-secondary font-[Poppins-SemiBold]">
                  Resend in {resendCooldown}s
                </Text>
              ) : (
                <TouchableOpacity
                  disabled={isResending}
                  onPress={async () => {
                    setIsResending(true);
                    setCode(["", "", "", "", "", ""]);
                    setError("");
                    try {
                      await onResend();
                      setResendCooldown(60);
                    } catch {
                      setError("Failed to resend code. Please try again.");
                    } finally {
                      setIsResending(false);
                    }
                  }}
                >
                  <Text className="body-medium text-lingua-purple font-[Poppins-SemiBold]">
                    {isResending ? "Sending..." : "Resend"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {!isSuccess && (
              <TouchableOpacity
                className="bg-lingua-purple rounded-[14px] py-4 items-center"
                activeOpacity={0.85}
                onPress={onClose}
              >
                <Text className="text-[16px] font-[Poppins-SemiBold] text-white">
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  avoidingView: {
    width: "100%",
  },
  codeBox: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#f6f7fb",
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: "#0d132b",
  },
  codeBoxFilled: {
    borderColor: "#6c4ef5",
    backgroundColor: "#f0ecff",
  },
  codeBoxSuccess: {
    borderColor: "#21c16b",
    backgroundColor: "#e6f9f0",
  },
});
