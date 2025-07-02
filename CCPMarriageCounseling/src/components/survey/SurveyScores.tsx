// components/survey/SurveyScores.tsx

import { View, Text } from "react-native"

const colorBlue = "#00C9C8"
const colorRed = "#FF807D"

const MBTI_LABELS: Record<string, [string, string]> = {
  I: ["Introversion", "Hướng nội"],
  E: ["Extraversion", "Hướng ngoại"],
  S: ["Sensing", "Cảm nhận"],
  N: ["iNtuition", "Trực giác"],
  T: ["Thinking", "Lý trí"],
  F: ["Feeling", "Cảm xúc"],
  J: ["Judging", "Nguyên tắc"],
  P: ["Perceiving", "Linh hoạt"],
}

const MBTI_PAIRS = [
  ["I", "E"],
  ["S", "N"],
  ["T", "F"],
  ["J", "P"],
]

const LABEL_TRANSLATIONS: Record<string, string> = {
  Dominance: "Thống trị",
  Influence: "Ảnh hưởng",
  Steadiness: "Kiên định",
  Conscientiousness: "Tận tâm",
  WordsofAffirmation: "Lời nói yêu thương",
  ActsofService: "Hành động quan tâm",
  ReceivingGifts: "Nhận quà",
  QualityTime: "Thời gian chất lượng",
  PhysicalTouch: "Tiếp xúc thể chất",
  Openness: "Cởi mở",
  Conscientiousness_BF: "Tận tâm",
  Extraversion: "Hướng ngoại",
  Agreeableness: "Hòa đồng",
  Neuroticism: "Bất ổn cảm xúc",
}

const normalizeKey = (label: string) => label.replace(/\s+/g, "")

const StackedBar = ({ leftCode, rightCode, left, right }: any) => {
  const leftLabel = MBTI_LABELS[leftCode]
  const rightLabel = MBTI_LABELS[rightCode]
  const isLeftDominant = left > right

  const dominantText = isLeftDominant
    ? `${left.toFixed(0)}% ${leftLabel[0]} (${leftLabel[1]})`
    : `${right.toFixed(0)}% ${rightLabel[0]} (${rightLabel[1]})`

  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-center mb-2 text-[#333]">{dominantText}</Text>
      <View className="flex-row h-4 w-full rounded-full overflow-hidden bg-gray-200">
        <View style={{ width: `${left}%`, backgroundColor: colorRed }} className="h-full" />
        <View style={{ width: `${right}%`, backgroundColor: colorBlue }} className="h-full" />
      </View>
      <View className="flex-row justify-between mt-1 px-1">
        <Text className="text-xs text-gray-600">{leftLabel[0]}</Text>
        <Text className="text-xs text-gray-600">{rightLabel[0]}</Text>
      </View>
    </View>
  )
}

const Bar = ({ label, percent }: { label: string; percent: number }) => {
  const normalizedKey = normalizeKey(label)
  const translated = LABEL_TRANSLATIONS[normalizedKey] || "Không rõ"

  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-center mb-2 text-[#333]">
        {label} ({translated}) {percent.toFixed(0)}%
      </Text>
      <View className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
        <View style={{ width: `${percent}%`, backgroundColor: colorRed }} className="h-full" />
      </View>
    </View>
  )
}

const SurveyScores = ({
  scores,
  surveyId,
}: {
  scores: Record<string, number>
  surveyId: string
}) => {
  if (surveyId === "SV001") {
    return MBTI_PAIRS.map(([a, b]) => {
      const scoreA = scores[a] || 0
      const scoreB = scores[b] || 0
      const total = scoreA + scoreB || 1
      const percentA = (scoreA / total) * 100
      const percentB = (scoreB / total) * 100

      return (
        <StackedBar
          key={`${a}${b}`}
          leftCode={a}
          rightCode={b}
          left={percentA}
          right={percentB}
        />
      )
    })
  }

  const total = Object.values(scores).reduce((acc, v) => acc + v, 0) || 1

  return Object.entries(scores).map(([key, value]) => {
    const percent = (value / total) * 100
    return <Bar key={key} label={key} percent={percent} />
  })
}

export default SurveyScores
