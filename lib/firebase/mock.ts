// Mock Firebase functions for development/testing
// This allows the app to run without actual Firebase connection

export const mockFirestore = {
  collection: (path: string) => ({
    add: async (data: any) => ({
      id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }),
    doc: (id: string) => ({
      update: async (data: any) => Promise.resolve(),
      get: async () => ({
        exists: true,
        data: () => ({})
      })
    })
  }),
  doc: (path: string) => ({
    update: async (data: any) => Promise.resolve(),
    get: async () => ({
      exists: true,
      data: () => ({})
    })
  })
}

export const mockStorage = {
  ref: (path: string) => ({
    put: async (file: File) => ({
      ref: {
        getDownloadURL: async () => `https://mock-storage.com/${path}/${file.name}`
      }
    })
  })
}

export const mockTimestamp = {
  now: () => new Date(),
  fromDate: (date: Date) => date
}