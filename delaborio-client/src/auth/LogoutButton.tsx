interface LogoutButtonnProps {
  onClick: () => void;
}

export default function LogoutButton(props: LogoutButtonnProps) {
  return (
    <button onClick={props.onClick} className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 m-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      Logout
    </button>
  )
}