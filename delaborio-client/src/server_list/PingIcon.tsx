import './PingIcon.css';

interface PingIconProps {
  ping: number;
}

export default function PingIcon(props: PingIconProps) {
  const className = 
      props.ping < 0 ? 'none' : 
      props.ping < 50 ? 'full' :
      props.ping < 100 ? 'high' :
      props.ping < 200 ? 'mid' : 'low';

  return (
    <div className={`ping-container ${className}`}>
      <div className="left"></div>
      <div className="right"></div>
    </div>
  )
}