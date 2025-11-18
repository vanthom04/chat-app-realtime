export const HomePage = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-slate-800">
      <img
        className="object-cover size-[120px] lg:size-[160px]"
        src="/images/logo.png"
        alt="Chats"
      />
      <h2 className="text-xl font-semibold text-primary">Chào mừng bạn đến với Chatio</h2>
      <p className="text-muted-foreground text-[15px] dark:text-white">
        Chọn một cuộc hội thoại để bắt đầu trò chuyện.
      </p>
    </div>
  )
}
