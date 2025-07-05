// src/components/common/HTMLViewer.tsx
import { useWindowDimensions, ScrollView } from "react-native"
import RenderHTML from "react-native-render-html"

interface HTMLViewerProps {
  htmlContent: string
}

const HTMLViewer = ({ htmlContent }: HTMLViewerProps) => {
  const { width } = useWindowDimensions()

  return (
    <ScrollView className="px-4 pb-6">
      <RenderHTML
        contentWidth={width}
        source={{ html: htmlContent }}
        baseStyle={{
          fontSize: 16,
          color: "#2d2d2d",
          lineHeight: 24,
        }}
        tagsStyles={{
          h1: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
          h2: { fontSize: 20, fontWeight: "bold", marginVertical: 8 },
          h3: { fontSize: 18, fontWeight: "600", marginVertical: 6 },
          p: { marginBottom: 8 },
          li: { marginBottom: 4 },
          ul: { paddingLeft: 20 },
          ol: { paddingLeft: 20 },
          table: {
            borderWidth: 1,
            borderColor: "#000",
            width: "100%",
          },
          th: {
            backgroundColor: "#eee",
            borderWidth: 1,
            borderColor: "#000",
            padding: 8,
            fontWeight: "bold",
          },
          td: {
            borderWidth: 1,
            borderColor: "#000",
            padding: 8,
          },
        }}
      />
    </ScrollView>
  )
}

export default HTMLViewer
