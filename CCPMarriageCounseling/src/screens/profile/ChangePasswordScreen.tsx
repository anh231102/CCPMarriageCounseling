import React, { useState } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native"
import accountApi from "@/src/config/api/account.api"
import { useNavigation } from "@react-navigation/native"
import MyProfileComponent from "@/src/components/share/MyProfileComponent"
import { Ionicons } from "@expo/vector-icons"

const ChangePasswordScreen = () => {
    const navigation = useNavigation<any>()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // State lưu lỗi
    const [errorCurrent, setErrorCurrent] = useState("")
    const [errorNew, setErrorNew] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")
    const [apiError, setApiError] = useState("")


    const handleChangePassword = async () => {
        let hasError = false
        setErrorCurrent("")
        setErrorNew("")
        setErrorConfirm("")
        setApiError("")

        if (!currentPassword) {
            setErrorCurrent("Vui lòng nhập mật khẩu hiện tại")
            hasError = true
        } else if (currentPassword.length < 6) {
            setErrorCurrent("Mật khẩu phải có ít nhất 6 ký tự")
            hasError = true
        }
        if (!newPassword) {
            setErrorNew("Vui lòng nhập mật khẩu mới")
            hasError = true
        } else if (newPassword.length < 6) {
            setErrorNew("Mật khẩu phải có ít nhất 6 ký tự")
            hasError = true
        }
        if (!confirmPassword) {
            setErrorConfirm("Vui lòng xác nhận mật khẩu mới")
            hasError = true
        } else if (confirmPassword.length < 6) {
            setErrorConfirm("Mật khẩu phải có ít nhất 6 ký tự")
            hasError = true
        }
        if (
            newPassword &&
            confirmPassword &&
            newPassword.length >= 6 &&
            confirmPassword.length >= 6 &&
            newPassword !== confirmPassword
        ) {
            setErrorConfirm("Mật khẩu mới và xác nhận không khớp")
            hasError = true
        }
        if (hasError) return

        setLoading(true)
        try {
            const message = await accountApi.putChangePassword({
                currentPassword,
                newPassword,
                confirmPassword,
            })

            // Khi thành công, trở về trang trước
            navigation.goBack()
        } catch (err: any) {
            let errorMsg = "Đổi mật khẩu thất bại!";
            if (err.response && (err.response.data?.error || err.response.data?.message)) {
                errorMsg = err.response.data.error || err.response.data.message;
            }
            setApiError(errorMsg)
        }
        finally {
            setLoading(false)
        }
    }

    const renderInput = (
        placeholder: string,
        value: string,
        onChange: (text: string) => void,
        errorMessage: string,
        secure: boolean,
        onToggleSecure: () => void
    ) => (
        <View style={{ marginBottom: 16 }}>
            <View style={{ position: "relative" }}>
                <TextInput
                    placeholder={placeholder}
                    secureTextEntry={secure}
                    value={value}
                    onChangeText={onChange}
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: errorMessage ? "#E83E8C" : "#E5E7EB",
                        paddingRight: 40,
                    }}
                />
                <TouchableOpacity
                    onPress={onToggleSecure}
                    style={{ position: "absolute", right: 10, top: 12 }}
                >
                    <Ionicons name={secure ? "eye-off" : "eye"} size={22} color="#888" />
                </TouchableOpacity>
            </View>
            {errorMessage ? (
                <Text style={{ color: "#E83E8C", marginTop: 4, fontSize: 13 }}>{errorMessage}</Text>
            ) : null}
        </View>
    )

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Khung bao quanh */}
                <View
                    style={{
                        backgroundColor: "#F9FAFB",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        padding: 24,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                    }}
                >
                    {/* Avatar */}
                    <View style={{ alignItems: "center", marginBottom: 24 }}>
                        <MyProfileComponent image name />
                    </View>

                    {renderInput(
                        "Mật khẩu hiện tại",
                        currentPassword,
                        setCurrentPassword,
                        errorCurrent,
                        !showCurrent,
                        () => setShowCurrent((v) => !v)
                    )}
                    {renderInput(
                        "Mật khẩu mới",
                        newPassword,
                        setNewPassword,
                        errorNew,
                        !showNew,
                        () => setShowNew((v) => !v)
                    )}
                    {renderInput(
                        "Xác nhận mật khẩu mới",
                        confirmPassword,
                        setConfirmPassword,
                        errorConfirm,
                        !showConfirm,
                        () => setShowConfirm((v) => !v)
                    )}

                    {apiError ? (
                        <Text style={{ color: "#E83E8C", marginBottom: 12, fontSize: 14, textAlign: "center" }}>
                            {apiError}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        onPress={handleChangePassword}
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? "#E5E7EB" : "#E83E8C",
                            padding: 16,
                            borderRadius: 8,
                            alignItems: "center",
                            marginTop: 8,
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default ChangePasswordScreen
