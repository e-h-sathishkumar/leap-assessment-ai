export const Messages = {
  subject: {
    created: "Subject created successfully.",
    updated: "Subject updated successfully.",
    deleted: "Subject deleted successfully.",

    createError: "Unable to create subject.",
    updateError: "Unable to update subject.",
    deleteError: "Unable to delete subject.",

    validation:
      "Subject name and code are required.",
  },

  chapter: {
    created: "Chapter created successfully.",
    updated: "Chapter updated successfully.",
    deleted: "Chapter deleted successfully.",

    createError: "Unable to create chapter.",
    updateError: "Unable to update chapter.",
    deleteError: "Unable to delete chapter.",

    validation:
      "Subject, chapter name and chapter code are required.",
  },

  topic: {
    created: "Topic created successfully.",
    updated: "Topic updated successfully.",
    deleted: "Topic deleted successfully.",

    createError: "Unable to create topic.",
    updateError: "Unable to update topic.",
    deleteError: "Unable to delete topic.",

    validation:
      "Subject, chapter and topic are required.",
  },

  question: {
    created: "Question created successfully.",
    updated: "Question updated successfully.",
    deleted: "Question deleted successfully.",

    createError: "Unable to create question.",
    updateError: "Unable to update question.",
    deleteError: "Unable to delete question.",

    validation:
      "Please complete all mandatory fields.",
  },
} as const;