import React from "react"
import { ScrollView, Text, View } from "react-native"
import ListPost from "@/src/components/post/ListPost"

const ListAllPostScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50  ">
      <ListPost allscreen />
    </ScrollView>
  )
}

export default ListAllPostScreen