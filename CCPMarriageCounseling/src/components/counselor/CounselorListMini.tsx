// src/components/CounselorCardListHorizontal.tsx
import { FlatList, TouchableOpacity, View, Text, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Counselor } from "@/src/config/types/counselor.type"

interface Props {
  data: Counselor[]
}

const CounselorListMini = ({ data }: Props) => {
  const navigation = useNavigation<any>()

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
  onPress={() =>
    navigation.navigate("CounselorsTab", {
      screen: "CounselorDetail",
      params: { counselor: item },
    })
  }
  className="mr-4 bg-white rounded-lg shadow-sm p-3 w-40"
>

          <Image
            source={{ uri: item.avatar || "https://via.placeholder.com/100" }}
            className="w-16 h-16 rounded-full self-center mb-2"
          />
          <Text className="text-secondary-dark font-bold text-center">{item.fullname}</Text>
          <Text className="text-secondary text-xs text-center">
            {item.subCategories.map((cat) => cat.name).join(", ")}
          </Text>
          <View className="flex-row items-center justify-center mt-2">
            <Text className="text-warning font-bold">★</Text>
            <Text className="text-secondary-dark ml-1">{item.rating}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  )
}

export default CounselorListMini
