import { TypeAnimation } from 'react-type-animation';

function TypingAnim() {
  return (
    <TypeAnimation
    sequence={[
      // Same substring at the start will only be typed out once, initially
      'Posez moi des questions sur La Science',
      1000, // wait 1s before replacing "Mice" with "Hamsters"
      'Posez moi des questions sur La Politique',
      1000,
      'Posez moi des questions sur L\'Histoire',
      1000,
      'Posez moi des questions sur La Philosophie',
      1000,
      'Posez moi des questions sur Tout ce qui vous passe par la tête !',
      1000
    ]}
    wrapper="span"
    speed={50}
    style={{ fontSize: '60px', color:'white', display:'inline-block', textShadow:'1px 1px 20px #000' }}
    repeat={Infinity}
  />
  )
}

export default TypingAnim