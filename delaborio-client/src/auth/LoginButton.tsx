interface LoginButtonProps {
  oauthUrl: string;
  logo: string;
  name: string;
}

export default function LoginButton(props: LoginButtonProps) {
  return (
    <a href={props.oauthUrl} target="_blank" rel="noopener noreferrer" className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 m-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <img alt={`${props.name}'s logo`} className="h-6 w-6 mr-2" src={`data:image/svg+xml;utf8,${encodeURIComponent(props.logo)}`} />
      Login with {props.name}
    </a>
  )
}