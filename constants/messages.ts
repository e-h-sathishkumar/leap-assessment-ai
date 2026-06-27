export const Messages = {
  subject: {
    created: "Subject created successfully.",
    updated: "Subject updated successfully.",
    deleted: "Subject deleted successfully.",

    createError: "Unable to create subject.",
    updateError: "Unable to update subject.",
    deleteError: "Unable to delete subject.",

    validation:
      "Subject and chapter name are required.",
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
} as const;