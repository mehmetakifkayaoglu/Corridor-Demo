import { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styled from "@emotion/styled";

const Scene = styled.div`
  position: relative;
  height: 100dvh;
  perspective: 800px;
  perspective-origin: 50% 40%;
`;

const Hall = styled(motion.div)`
  position: absolute;
  inset: -20vh -20vw;
  transform-style: preserve-3d;
`;

const Panel = styled.div`
  position: absolute;
  height: 100%;
  width: 50%;
  background: linear-gradient(180deg, #1b2430, #0f1318);
  box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.6);
`;

const LeftWall = styled(Panel)`
  left: 0;
  transform-origin: right center;
  transform: rotateY(65deg) translateZ(200px) translateX(-200px);
  background: linear-gradient(90deg, #0d1117, #1b2430);
`;

const RightWall = styled(Panel)`
  right: 0;
  transform-origin: left center;
  transform: rotateY(-65deg) translateZ(200px) translateX(200px);
  background: linear-gradient(270deg, #0d1117, #1b2430);
`;

const Floor = styled.div<{ z: number }>`
  position: absolute;
  left: 50%;
  width: 100%;
  height: 60%;
  top: 40%;
  transform-origin: center top;
  transform: perspective(800px) rotateX(80deg)
    translateY(${(p) => p.z * -0.15}px) scaleY(${(p) => 1 + p.z * 0.0006});
  background: radial-gradient(
      closest-side,
      rgba(255, 255, 255, 0.12),
      transparent 60%
    ),
    repeating-linear-gradient(0deg, #0e1218 0 6px, #10151b 6px 12px);
  filter: brightness(1.1);
  will-change: transform;
`;

const Item = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  background: rgba(255, 255, 255, 0.06);
  padding: 16px 20px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  outline: 1px solid rgba(255, 255, 255, 0.08);
  will-change: transform;

  h2 {
    margin: 0 0 6px;
    font-weight: 700;
    font-size: 18px;
  }
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
  }
`;

export default function Corridor() {
  const [z, setZ] = useState(0);
  const controls = useAnimation();
  const vref = useRef(0);

  useEffect(() => {
    controls.start({ z, transition: { type: "tween", duration: 0.25 } });
  }, [z, controls]);

  const onWheel = (e: React.WheelEvent) => {
    vref.current = Math.max(0, Math.min(5000, vref.current + e.deltaY));
    setZ(vref.current);
  };

  return (
    <Scene onWheel={onWheel}>
      <Hall animate={controls}>
        <LeftWall />
        <Floor z={z} />
        <RightWall />

        <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(${
              300 - z
            }px)`,
          }}
        >
          <h2>Checkpoint A</h2>
          <p>Bir açıklama metni.</p>
        </Item>

        <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(${
              900 - z
            }px)`,
          }}
        >
          <h2>Info Panel</h2>
          <p>Scroll ettikçe yaklaşır.</p>
        </Item>

        <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(${
              1500 - z
            }px)`,
          }}
        >
          <h2>Gallery</h2>
          <p>Buraya bileşen/galeri bağlarız.</p>
        </Item>
      </Hall>
    </Scene>
  );
}
