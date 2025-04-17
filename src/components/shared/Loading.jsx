import styled, { keyframes } from 'styled-components';

const commonStyle = {
    margin: 'auto',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
};

const sizeItem = {
    small: '40px',
    default: '50px',
    large: '60px',
};

const delay = (index) => keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

const LoadingContainer = styled.div`
  width: ${(props) => (props.size === 'small' ? 400 : props.size === 'large' ? 800 : 650)}px;
  height: ${(props) => (props.size === 'small' ? 150 : props.size === 'large' ? 190 : 160.5)}px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-flow: nowrap;
`;

const Char = styled.div`
  width: ${(props) => sizeItem[props.size] || sizeItem['default']};
  height: ${(props) => sizeItem[props.size] || sizeItem['default']};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${(props) => delay(props.index)} ${(props) => props.speed || 1}s ease-in-out infinite;
`;

const Loading = ({ style = commonStyle, speed, size }) => {
    const characters = 'Book Managment';
    return (
        <LoadingContainer style={style} size={size}>
            {characters.split('').map((char, index) => (
                <Char key={index} speed={speed} size={size} index={index}>
                    {char}
                </Char>
            ))}
        </LoadingContainer>
    );
};

export default Loading;
