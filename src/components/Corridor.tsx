import { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styled from "@emotion/styled";

const Scene = styled.div`
  position: relative;
  height: 100dvh;
  perspective: 900px;
  perspective-origin: 50% 45%;
  overflow: hidden;
  background: #0d0f13;
`;

const Group = styled(motion.div)`
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
`;

/* Ortak plane stilleri */
const Plane = styled.div`
  position: absolute;
  width: 40000px; /* büyük tut: kesişme hissini azaltır */
  height: 40000px;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  backface-visibility: hidden; /* arka yüz görünmesin */
`;

/* Zemin ve tavan */
const Floor = styled(Plane)`
  background: radial-gradient(
      closest-side,
      rgba(255, 255, 255, 0.12),
      transparent 60%
    ),
    repeating-linear-gradient(0deg, #490515ff 0 6px, #ae0202ff 6px 12px);
  filter: brightness(1.05);
  transform: translate3d(-50%, -50%, 0) rotateX(90deg) /* gerçek yatay düzlem */
    translateZ(-300px); /* kameradan biraz aşağıda dursun */
`;

const Ceiling = styled(Plane)`
  background: linear-gradient(180deg, #ffffffff, #82b6f5ff);
  transform: translate3d(-50%, -50%, 0) rotateX(-90deg) translateZ(-500px); /* tavan yüksekliği */
`;

/* Yan duvarlar */
const LeftWall = styled(Plane)`
  background: linear-gradient(90deg, #ffffffff, #82b6f5ff);
  transform: translate3d(-50%, -50%, 0) rotateY(90deg)
    /* sola bakan dik duvar */ translateZ(-400px); /* koridor genişliği/2 */
`;

const RightWall = styled(Plane)`
  background: linear-gradient(270deg, #ffffff, #82b6f5ff);
  transform: translate3d(-50%, -50%, 0) rotateY(-90deg)
    /* sağa bakan dik duvar */ translateZ(-400px);
`;

/* Koridorun “arka” paneli (ufuk/background) */
const Back = styled(Plane)`
  background: radial-gradient(60% 60% at 50% 50%, #121720, #0b0e12 70%);
  transform: translate3d(-50%, -50%, 0) translateZ(-20000px);
`;

/* İçerik kartları (sahne ekseninde konumlanır) */
const Item = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  background: rgba(12, 134, 45, 0.4);
  padding: 16px 20px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  outline: 1px solid rgba(255, 255, 255, 0.08);
  color: #020203ff;
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
  const [z, setZ] = useState(0); // “ilerleme” (px)
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const zref = useRef(0);
  const xref = useRef(0);
  const yref = useRef(0);

  useEffect(() => {
    controls.start({
      // Sahnenin tamamını -Z’ye it (kamera sabit)
      // framer-motion burada style yerine animate ile çalışıyor
      // ama styled tarafında toplayıp inline vermek daha kolay:
      // animate prop'unda custom CSS var yerine "style" kullanacağız:
    });
  }, [controls]);

  useEffect(() => {
    controls.start({
      rotateX: tilt.x,
      rotateY: tilt.y,
      transition: { type: "spring", stiffness: 80 },
    });
  }, [tilt, controls]);

  function sinDeg(degree: number) {
    const radian = (degree * Math.PI) / 180;
    return Math.sin(radian);
  }

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    zref.current = Math.max(0, Math.min(100000, zref.current + e.deltaY));
    xref.current += sinDeg(tilt.y) * e.deltaY;
    yref.current -= sinDeg(tilt.x) * e.deltaY;
    setZ(zref.current);
    setX(xref.current);
    setY(yref.current);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientY / innerHeight - 0.5) * -180; // dikey → rotateX
    const y = (e.clientX / innerWidth - 0.5) * 180; // yatay → rotateY
    setTilt({ x, y });
  };

  return (
    <Scene onWheel={onWheel}>
      {/* style ile tek transform: tüm sahne -Z’ye gider */}
      <Group
        onMouseMove={onMouseMove}
        style={{
          transform: `translateZ(${z}px)  translateX(${x}px) translateY(${y}px) 
                    rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <Floor />
        <Ceiling />
        <LeftWall />
        <RightWall />
        <Back />

        {/* İçerikler sahnede -Z'de bekler; biz yaklaşınca görünür */}
        <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(-200px) rotateY(90deg)`,
            height: `500px`,
            width: `300px`,
            left: `30%`,
          }}
        >
          <h2>Checkpoint A</h2>
          <p>İlk panel.</p>
        </Item>

        <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(-700px) rotateY(90deg)`,
            height: `500px`,
            width: `300px`,
            left: `30%`,
          }}
        >
          <h2>Checkpoint B</h2>
          <p>Ikinci panel.</p>
        </Item>

                <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(-3000px) rotateY(90deg)`,
            height: `500px`,
            width: `300px`,
            left: `30%`,
          }}
        >
          <h2>Checkpoint C</h2>
          <p>Ikinci panel.</p>
        </Item>

        <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(-200px) rotateX(90deg)`,
            top: `75%`,
            left: `50%`,
            height: `300px`,
            width: `400px`,
            background: `rgba(12, 134, 45, 1)`,
          }}
        >
          <h1>Info Panel 1</h1>
          <p>Yaklaştıkça belirir.</p>
        </Item>

        <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(-700px) rotateX(90deg)`,
            top: `75%`,
            left: `50%`,
            height: `300px`,
            width: `400px`,
            background: `rgba(12, 134, 45, 1)`,
          }}
        >
          <h1>Info Panel 2</h1>
          <p>Yaklaştıkça belirir.</p>
        </Item>

                <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(-3000px) rotateX(90deg)`,
            top: `75%`,
            left: `50%`,
            height: `300px`,
            width: `400px`,
            background: `rgba(12, 134, 45, 1)`,
          }}
        >
          <h1>Info Panel 3</h1>
          <p>Yaklaştıkça belirir.</p>
        </Item>

        <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(-200px) rotateY(-90deg)`,
            top: `50%`,
            left: `70%`,
            height: `500px`,
            width: `300px`,
          }}
        >
          <h2>Gallery</h2>
          <p>Buraya içerik/galeri bağlarız.</p>
        </Item>

        <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(-700px) rotateY(-90deg)`,
            top: `50%`,
            left: `70%`,
            height: `500px`,
            width: `300px`,
          }}
        >
          <h2>Gallery 2</h2>
          <p>Buraya içerik/galeri bağlarız.</p>
        </Item>

                <Item
          style={{
            transform: `translateX(-50%) translateY(-50%) translateZ(-3000px) rotateY(-90deg)`,
            top: `50%`,
            left: `70%`,
            height: `500px`,
            width: `300px`,
          }}
        >
          <h2>Gallery 3</h2>
          <p>Buraya içerik/galeri bağlarız.</p>
        </Item>
      </Group>
    </Scene>
  );
}
