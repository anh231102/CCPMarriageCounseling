// src/components/share/OverlayLoading.tsx
import React from "react"
import { View, Modal, StyleSheet } from "react-native"
import Loading from "./Loading"

const OverlayLoading = () => {
  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <Loading size={60} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default OverlayLoading
