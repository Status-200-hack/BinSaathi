export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="material-symbols-outlined text-6xl text-stone-400 mb-4 block">
            wifi_off
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
          You're Offline
        </h1>
        
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          Don't worry! You can still use many features of the app. Your data will sync when you're back online.
        </p>
        
        <div className="space-y-3">
          <a 
            href="/"
            className="block w-full bg-primary text-white font-bold py-3 px-6 rounded-xl text-center"
          >
            Go to Home
          </a>
          
          <a 
            href="/scanner"
            className="block w-full bg-stone-200 dark:bg-stone-700 text-text-light dark:text-text-dark font-bold py-3 px-6 rounded-xl text-center"
          >
            Use Scanner (Offline)
          </a>
        </div>
        
        <div className="mt-8 p-4 bg-stone-100 dark:bg-stone-800 rounded-xl">
          <h3 className="font-bold text-text-light dark:text-text-dark mb-2">
            Available Offline:
          </h3>
          <ul className="text-sm text-stone-600 dark:text-stone-400 space-y-1">
            <li>• Device scanning and identification</li>
            <li>• View cached bin locations</li>
            <li>• Browse your recycling history</li>
            <li>• Check achievements and progress</li>
          </ul>
        </div>
      </div>
    </div>
  )
}