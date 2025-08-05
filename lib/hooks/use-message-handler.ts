export const useMessageHandler = () => {
  return {
    handleIncomingMessage: (message: any) => {
      console.log("Mock handler received message:", message)
    }
  }
}
