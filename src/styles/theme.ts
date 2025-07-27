export const themes = {
  dark: {
    background: {
      main: 'bg-gradient-to-br from-gray-900 via-black to-gray-900',
      pattern1: 'bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.1),_transparent_50%)]',
      pattern2: 'bg-[radial-gradient(circle_at_80%_20%,_rgba(255,255,255,0.05),_transparent_50%)]'
    },
    navigation : {
      main: 'px-6 py-3 rounded-lg border transition-all duration-300 transform hover:scale-105 backdrop-blur-sm dark:text-white text-gray-800',
      active: 'dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 dark:border-blue-500 dark:shadow-lg dark:shadow-blue-500/25 bg-gradient-to-r from-blue-400 to-purple-400 border-blue-300',
      inactive: 'dark:bg-gray-800/50 dark:border-gray-600 dark:hover:bg-gray-700/50 dark:hover:border-gray-500 bg-white/50 border-gray-300 hover:bg-gray-100/50',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
    },
    terminal: {
        background: {
            main: 'bg-gray-900/80 border-gray-700',
            pattern1: 'bg-gray-800 border-b border-gray-700'
        },
        text: {
            main: 'text-white',
            pattern1: 'text-gray-400',
            pattern2: 'text-green-400',
            pattern3: 'text-lime-400',
            pattern4: 'text-yellow-500 font-bold',
            pattern5: 'text-pink-600 font-bold',
            pattern6: 'text-orange-500 font-bold'
        }
    },
    header: {
      gradient: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400',
      divider: 'bg-gradient-to-r from-blue-500 to-purple-500'
    }
  },
  light: {
    background: {
      main: 'bg-gradient-to-br from-slate-50 via-white to-rose-50',
      pattern1: 'bg-[radial-gradient(circle_at_15%_85%,_rgba(168,85,247,0.1),_transparent_40%)]',
      pattern2: 'bg-[radial-gradient(circle_at_85%_15%,_rgba(244,63,94,0.1),_transparent_40%)]'
    },
    navigation: {
      main: 'px-6 py-3 rounded-lg border transition-all duration-300 transform hover:scale-105 backdrop-blur-sm',
      active: 'bg-gradient-to-r from-blue-400 to-purple-400 border-blue-300 shadow-lg shadow-blue-500/25 text-white',
      inactive: 'bg-white/50 border-gray-300 hover:bg-gray-100/50 text-gray-800'
    },
    text: {
      primary: 'text-slate-800',
      secondary: 'text-slate-500',
    },
    terminal: {
        background: {
            main: 'bg-white/80 border-slate-200',
            pattern1: 'bg-slate-100 border-b border-slate-200'
        },
        text: {
            main: 'text-slate-600',
            pattern1: 'text-slate-500',
            pattern2: 'text-gray-800',
            pattern3: 'text-indigo-600',
            pattern4: 'text-sky-600 font-semibold',
            pattern5: 'text-pink-600 font-semibold',
            pattern6: 'text-orange-600 font-semibold'
        }
    },
    header: {
      gradient: 'bg-gradient-to-r from-violet-400 via-purple-400 to-rose-400',
      divider: 'bg-gradient-to-r from-violet-500 to-purple-500'
    }
  }
} as const;

export type ThemeType = keyof typeof themes;