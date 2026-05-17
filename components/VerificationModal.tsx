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
  onSuccess?: () => void;
};

export default function VerificationModal({
  visible,
  email,
  onClose,
  onSuccess,
}: Props) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (visible) {
      setCode(["", "", "", "", "", ""]);
      setIsSuccess(false);
      setTimeout(() => inputs.current[0]?.focus(), 200);
    }
  }, [visible]);

  function handleChange(text: string, index: number) {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "") && digit) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          router.replace("/");
        }
      }, 1000);
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

            {/* Resend link */}
            <View className="flex-row justify-center mb-8">
              <Text className="body-medium text-text-secondary">
                Didn&apos;t receive it?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => setCode(["", "", "", "", "", ""])}
              >
                <Text className="body-medium text-lingua-purple font-[Poppins-SemiBold]">
                  Resend
                </Text>
              </TouchableOpacity>
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
