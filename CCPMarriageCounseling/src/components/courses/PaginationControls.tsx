import type React from "react"
import { View, Text, TouchableOpacity } from "react-native"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Number of page buttons to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  return (
    <View className="flex-row justify-center items-center mt-4 mb-8">
      <TouchableOpacity
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-200" : "bg-primary"} mr-2`}
      >
        <Text className={`font-bold ${currentPage === 1 ? "text-gray-500" : "text-white"}`}>Trước</Text>
      </TouchableOpacity>

      {getPageNumbers().map((page) => (
        <TouchableOpacity
          key={page}
          onPress={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md ${currentPage === page ? "bg-primary-dark" : "bg-gray-200"} mx-1`}
        >
          <Text className={`font-bold ${currentPage === page ? "text-white" : "text-gray-700"}`}>{page}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-200" : "bg-primary"} ml-2`}
      >
        <Text className={`font-bold ${currentPage === totalPages ? "text-gray-500" : "text-white"}`}>Sau</Text>
      </TouchableOpacity>
    </View>
  )
}
