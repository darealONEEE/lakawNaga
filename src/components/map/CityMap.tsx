import { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store/appStore'
import { destinations, type DestinationId } from '../../data/destinations'

// ── Shared helpers ────────────────────────────────────────────────────────────
function B({ x=0, y=0, z=0, w=1, h=1, d=1, color='#888', shadow=true }:
  { x?:number; y?:number; z?:number; w?:number; h?:number; d?:number; color?:string; shadow?:boolean }) {
  return (
    <mesh position={[x, y, z]} castShadow={shadow} receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshLambertMaterial color={color} />
    </mesh>
  )
}

function Cone({ x=0, y=0, z=0, r=1, h=1, sides=4, rotY=0, color='#888' }:
  { x?:number; y?:number; z?:number; r?:number; h?:number; sides?:number; rotY?:number; color?:string }) {
  return (
    <mesh position={[x, y, z]} rotation={[0, rotY, 0]} castShadow>
      <coneGeometry args={[r, h, sides, 1]} />
      <meshLambertMaterial color={color} />
    </mesh>
  )
}

function HipRoof({ x=0, y=0, z=0, r=1, h=0.7, color='#2B6E2B' }:
  { x?:number; y?:number; z?:number; r?:number; h?:number; color?:string }) {
  return <Cone x={x} y={y} z={z} r={r} h={h} sides={4} rotY={Math.PI/4} color={color} />
}

function Tree({ x=0, z=0, s=1 }: { x?:number; z?:number; s?:number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <B x={0} y={0.22} z={0} w={0.1} h={0.44} d={0.1} color="#5C3D28" />
      <Cone x={0} y={0.65} z={0} r={0.28} h={0.55} sides={6} color="#3D7254" />
      <Cone x={0} y={0.95} z={0} r={0.2}  h={0.45} sides={6} color="#315B43" />
    </group>
  )
}

function Palm({ x=0, z=0, s=1 }: { x?:number; z?:number; s?:number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <B x={0} y={0.6} z={0} w={0.09} h={1.2} d={0.09} color="#6B4C30" />
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.32, 7, 5]} />
        <meshLambertMaterial color="#3D6840" />
      </mesh>
    </group>
  )
}

// ── Surrounding city: small house ─────────────────────────────────────────────
function SmHouse({ x=0, z=0, rot=0, wc='#E8DFC8', rc='#8B4A3A', sw=1.1, sd=0.95 }:
  { x?:number; z?:number; rot?:number; wc?:string; rc?:string; sw?:number; sd?:number }) {
  const bh = 0.6
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <B x={0} y={bh/2} z={0} w={sw} h={bh} d={sd} color={wc} />
      <HipRoof x={0} y={bh} z={0} r={Math.max(sw,sd)*0.76} h={bh*0.72} color={rc} />
      <B x={ sw*0.23} y={bh*0.64} z={sd*0.505} w={0.19} h={0.17} d={0.03} color="#A8C0C8" shadow={false} />
      <B x={-sw*0.23} y={bh*0.64} z={sd*0.505} w={0.19} h={0.17} d={0.03} color="#A8C0C8" shadow={false} />
      <B x={0}        y={bh*0.27} z={sd*0.505} w={0.15} h={0.27} d={0.03} color="#7A5840" shadow={false} />
    </group>
  )
}

function ShopBuilding({ x=0, z=0, rot=0, wc='#D8CEBC', rc='#6A3A2A' }:
  { x?:number; z?:number; rot?:number; wc?:string; rc?:string }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <B x={0}     y={0.62} z={0}     w={1.4}  h={1.24} d={1.1}  color={wc} />
      <HipRoof x={0} y={1.26} z={0} r={1.06} h={0.6} color={rc} />
      <B x={0}     y={0.22} z={0.555} w={1.05} h={0.28} d={0.03} color="#B0C8D0" shadow={false} />
      <B x={ 0.35} y={0.75} z={0.555} w={0.24} h={0.2}  d={0.03} color="#B0C8D0" shadow={false} />
      <B x={-0.05} y={0.75} z={0.555} w={0.24} h={0.2}  d={0.03} color="#B0C8D0" shadow={false} />
      <B x={-0.45} y={0.75} z={0.555} w={0.24} h={0.2}  d={0.03} color="#B0C8D0" shadow={false} />
    </group>
  )
}

// ── Vehicles ──────────────────────────────────────────────────────────────────
function Car({ x=0, z=0, rot=0, color='#446699' }:
  { x?:number; z?:number; rot?:number; color?:string }) {
  return (
    <group position={[x, 0.12, z]} rotation={[0, rot, 0]}>
      <B x={0}    y={0.10} z={0}     w={0.75} h={0.22} d={0.38} color={color} />
      <B x={-0.1} y={0.27} z={0}     w={0.42} h={0.17} d={0.32} color={color} />
      <B x={0.10} y={0.27} z={0}     w={0.15} h={0.14} d={0.28} color="#C8E0EA" shadow={false} />
      <B x={-0.3} y={0.27} z={0}     w={0.08} h={0.12} d={0.24} color="#C8E0EA" shadow={false} />
      <B x={-0.06} y={0.29} z={ 0.17} w={0.26} h={0.12} d={0.02} color="#C8E0EA" shadow={false} />
      <B x={-0.06} y={0.29} z={-0.17} w={0.26} h={0.12} d={0.02} color="#C8E0EA" shadow={false} />
      <B x={0.38} y={0.12} z={ 0.10} w={0.02} h={0.07} d={0.10} color="#FFFFC0" shadow={false} />
      <B x={0.38} y={0.12} z={-0.10} w={0.02} h={0.07} d={0.10} color="#FFFFC0" shadow={false} />
      {([[-0.27,-0.15],[-0.27,0.15],[0.27,-0.15],[0.27,0.15]] as [number,number][]).map(([wx,wz],i)=>(
        <mesh key={i} position={[wx,-0.09,wz]} rotation={[0,0,Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.08,0.08,0.10,8]} />
          <meshLambertMaterial color="#222" />
        </mesh>
      ))}
    </group>
  )
}

function Jeepney({ x=0, z=0, rot=0, body='#CC2222', stripe='#F0C040' }:
  { x?:number; z?:number; rot?:number; body?:string; stripe?:string }) {
  return (
    <group position={[x, 0.14, z]} rotation={[0, rot, 0]}>
      <B x={0}     y={0.18} z={0}     w={1.42} h={0.36} d={0.58} color={body} />
      <B x={0.02}  y={0.38} z={0}     w={1.35} h={0.09} d={0.64} color={stripe} />
      <B x={0.60}  y={0.24} z={0}     w={0.24} h={0.30} d={0.54} color="#BB2020" />
      <B x={0.70}  y={0.27} z={0}     w={0.06} h={0.20} d={0.42} color="#B8D8E8" shadow={false} />
      <B x={-0.04} y={0.27} z={ 0.30} w={0.90} h={0.14} d={0.02} color="#B8D8E8" shadow={false} />
      <B x={-0.04} y={0.27} z={-0.30} w={0.90} h={0.14} d={0.02} color="#B8D8E8" shadow={false} />
      <B x={-0.05} y={0.19} z={ 0.30} w={0.82} h={0.07} d={0.02} color={stripe} shadow={false} />
      <B x={-0.05} y={0.19} z={-0.30} w={0.82} h={0.07} d={0.02} color={stripe} shadow={false} />
      <B x={0.74}  y={0.15} z={0}     w={0.04} h={0.06} d={0.60} color="#C8C8C8" shadow={false} />
      <B x={-0.73} y={0.12} z={0}     w={0.04} h={0.08} d={0.42} color="#AA2020" shadow={false} />
      {([[-0.52,-0.25],[-0.52,0.25],[0.42,-0.25],[0.42,0.25]] as [number,number][]).map(([wx,wz],i)=>(
        <mesh key={i} position={[wx,-0.10,wz]} rotation={[0,0,Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.10,0.10,0.14,8]} />
          <meshLambertMaterial color="#222" />
        </mesh>
      ))}
    </group>
  )
}

function Tricycle({ x=0, z=0, rot=0, color='#EE8800' }:
  { x?:number; z?:number; rot?:number; color?:string }) {
  return (
    <group position={[x, 0.10, z]} rotation={[0, rot, 0]}>
      <B x={0} y={0.14} z={ 0.20} w={0.54} h={0.26} d={0.34} color={color} />
      <B x={0} y={0.30} z={ 0.20} w={0.57} h={0.07} d={0.36} color={color} />
      <B x={0} y={0.16} z={-0.12} w={0.20} h={0.28} d={0.44} color="#333" />
      {([[0.22,-0.10],[-0.22,-0.10],[0,0.20]] as [number,number][]).map(([wx,wz],i)=>(
        <mesh key={i} position={[wx,-0.06,wz]} rotation={[0,0,Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.07,0.07,0.10,8]} />
          <meshLambertMaterial color="#222" />
        </mesh>
      ))}
    </group>
  )
}

// ── Isometric camera constants ────────────────────────────────────────────────
// Camera at [20,20,20] → local -Z = [-0.577,-0.577,-0.577] → looks at origin.
// Computed: Ry(π/4) × Rx(-atan(1/√2)) × [0,0,-1] = [-0.577,-0.577,-0.577] ✓
const ISO_ZOOM  = 58
const ISO_ROT_X = -Math.atan(1 / Math.sqrt(2))  // ≈ -35.26°
const ISO_ROT_Y = Math.PI / 4                    // 45°

function CameraController() {
  const { selectedDestination } = useAppStore()
  const { camera, gl } = useThree()

  // smooth camera center (world XZ)
  const cx = useRef(0)
  const cz = useRef(0)
  const tx = useRef(0)
  const tz = useRef(0)
  const tZoom = useRef(ISO_ZOOM)

  // drag-to-pan state
  const panX    = useRef(0)
  const panZ    = useRef(0)
  const isDown  = useRef(false)
  const startXY = useRef({ x: 0, y: 0 })
  const lastXY  = useRef({ x: 0, y: 0 })
  const isPanning = useRef(false)
  const MAX_PAN = 9

  useEffect(() => {
    if (selectedDestination) {
      const dest = destinations.find(d => d.id === selectedDestination)
      if (dest) {
        tx.current = dest.scene3dPos[0] * 0.42
        tz.current = dest.scene3dPos[2] * 0.42
        tZoom.current = 78
      }
    } else {
      tx.current = 0
      tz.current = 0
      tZoom.current = ISO_ZOOM
    }
    panX.current = 0
    panZ.current = 0
  }, [selectedDestination])

  useEffect(() => {
    const el = gl.domElement
    el.style.cursor = 'grab'

    const onDown = (e: PointerEvent) => {
      isDown.current = true
      isPanning.current = false
      startXY.current = { x: e.clientX, y: e.clientY }
      lastXY.current  = { x: e.clientX, y: e.clientY }
      el.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!isDown.current) return
      const dist = Math.hypot(e.clientX - startXY.current.x, e.clientY - startXY.current.y)
      const dx = e.clientX - lastXY.current.x
      const dy = e.clientY - lastXY.current.y
      lastXY.current = { x: e.clientX, y: e.clientY }
      if (dist > 4 || isPanning.current) {
        isPanning.current = true
        const zoom  = (camera as THREE.OrthographicCamera).zoom
        const scale = 1.2 / zoom
        panX.current = THREE.MathUtils.clamp(panX.current - 0.707*(dx+dy)*scale, -MAX_PAN, MAX_PAN)
        panZ.current = THREE.MathUtils.clamp(panZ.current + 0.707*(dx-dy)*scale, -MAX_PAN, MAX_PAN)
      }
    }
    const onUp = () => { isDown.current = false; isPanning.current = false; el.style.cursor = 'grab' }
    const onWheel = (e: WheelEvent) => e.preventDefault()

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      el.removeEventListener('wheel', onWheel)
    }
  }, [camera, gl])

  useFrame((_, dt) => {
    const f = 1 - Math.exp(-4 * dt)
    const lx = tx.current + panX.current
    const lz = tz.current + panZ.current

    cx.current += (lx - cx.current) * f
    cz.current += (lz - cz.current) * f

    // Position shifts along the isometric rail; lookAt re-applied every frame
    // so React/R3F lifecycle can never leave the camera in the wrong orientation.
    // Direction is always [-20,-20,-20] → constant isometric view.
    camera.position.set(20 + cx.current, 20, 20 + cz.current)
    camera.lookAt(cx.current, 0, cz.current)

    const o = camera as THREE.OrthographicCamera
    o.zoom += (tZoom.current - o.zoom) * f
    o.updateProjectionMatrix()
  })

  return null
}

// ── Lighting ──────────────────────────────────────────────────────────────────
function Lighting() {
  return (
    <>
      <ambientLight color="#F5EDD8" intensity={0.9} />
      <directionalLight color="#FFF5E0" intensity={2.6} position={[12,20,8]}
        castShadow shadow-mapSize={[1024,1024]}
        shadow-camera-far={100}
        shadow-camera-left={-24} shadow-camera-right={24}
        shadow-camera-top={24}   shadow-camera-bottom={-24} />
      <directionalLight color="#C8D8E8" intensity={0.45} position={[-8,10,-6]} />
    </>
  )
}

// ── Ground + roads (28×28) ────────────────────────────────────────────────────
function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]} receiveShadow>
        <planeGeometry args={[28,28]} />
        <meshLambertMaterial color="#CEC2A4" />
      </mesh>
      <B x={0} y={-0.12} z={0} w={28.4} h={0.24} d={28.4} color="#9E8E6E" shadow={false} />
      {/* Main cross roads */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.01,0]}>
        <planeGeometry args={[1.4,28]} /><meshLambertMaterial color="#B8AD96" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.01,0]}>
        <planeGeometry args={[28,1.4]} /><meshLambertMaterial color="#B8AD96" />
      </mesh>
      {/* Secondary streets */}
      {([-4.5, 4.5] as number[]).map((cx,i) => (
        <mesh key={`sx${i}`} rotation={[-Math.PI/2,0,0]} position={[cx,0.01,0]}>
          <planeGeometry args={[0.7,28]} /><meshLambertMaterial color="#C0B59C" />
        </mesh>
      ))}
      {([-4, 4] as number[]).map((cz,i) => (
        <mesh key={`sz${i}`} rotation={[-Math.PI/2,0,0]} position={[0,0.01,cz]}>
          <planeGeometry args={[28,0.7]} /><meshLambertMaterial color="#C0B59C" />
        </mesh>
      ))}
      {/* Central plaza */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.02,0]}>
        <circleGeometry args={[1.5,16]} /><meshLambertMaterial color="#D8CEB2" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.025,0]}>
        <ringGeometry args={[1.45,1.62,16]} /><meshLambertMaterial color="#C29A51" transparent opacity={0.5} />
      </mesh>
      <B x={0} y={0.35} z={0} w={0.22} h={0.7} d={0.22} color="#E0D8C8" />
      <Cone x={0} y={0.82} z={0} r={0.14} h={0.28} sides={6} color="#C29A51" />
    </group>
  )
}

// ── Perimeter fence with gate openings at each road ───────────────────────────
function Fence() {
  const H    = 11.0   // half-extent of fence
  const STEP = 1.5    // post spacing
  const GATE = 1.1    // half-width of road gate opening
  const pc   = '#7A5030'
  const rc   = '#9A6A48'

  // collect [x,z] for all posts, skipping gate gaps
  const posts: [number,number][] = []
  for (let v = -H; v <= H + 0.01; v += STEP) {
    if (Math.abs(v) > GATE) {
      posts.push([v,  -H])   // north side
      posts.push([v,   H])   // south side
    }
  }
  for (let v = -H + STEP; v < H; v += STEP) {
    if (Math.abs(v) > GATE) {
      posts.push([-H, v])    // west side
      posts.push([ H, v])    // east side
    }
  }

  // rail segments: [cx, y, cz, w, d]
  const seg = H - GATE          // half-length of each rail piece
  const cx1 = -(H + GATE) / 2  // left / top half
  const cx2 =  (H + GATE) / 2  // right / bottom half

  type RS = [number,number,number,number,number]
  const rails: RS[] = [
    // North (z=-H): two X-rails
    [cx1,0.36,-H, seg,0.06], [cx1,0.20,-H, seg,0.06],
    [cx2,0.36,-H, seg,0.06], [cx2,0.20,-H, seg,0.06],
    // South (z=+H)
    [cx1,0.36, H, seg,0.06], [cx1,0.20, H, seg,0.06],
    [cx2,0.36, H, seg,0.06], [cx2,0.20, H, seg,0.06],
  ]
  type RSZ = [number,number,number,number,number]
  const railsZ: RSZ[] = [
    // West (x=-H): two Z-rails
    [-H,0.36,cx1, 0.06,seg], [-H,0.20,cx1, 0.06,seg],
    [-H,0.36,cx2, 0.06,seg], [-H,0.20,cx2, 0.06,seg],
    // East (x=+H)
    [ H,0.36,cx1, 0.06,seg], [ H,0.20,cx1, 0.06,seg],
    [ H,0.36,cx2, 0.06,seg], [ H,0.20,cx2, 0.06,seg],
  ]

  return (
    <group>
      {posts.map(([px,pz],i) => (
        <B key={`fp${i}`} x={px} y={0.22} z={pz} w={0.12} h={0.44} d={0.12} color={pc} />
      ))}
      {[...rails, ...railsZ].map(([cx,ry,cz,w,d],i) => (
        <B key={`fr${i}`} x={cx} y={ry} z={cz} w={w} h={0.05} d={d} color={rc} shadow={false} />
      ))}
    </group>
  )
}

// ── Zone 1: Basilica Minore (SE) ──────────────────────────────────────────────
function BasilicaZone({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (!ref.current) return
    ref.current.position.y += ((selected ? 0.2 : 0) - ref.current.position.y) * dt * 5
  })
  const cream = '#F0E8C0'; const dkCream = '#E2D8AC'
  const green = '#2B6428'; const dkGreen = '#1A4A18'
  const blue  = '#3878BE'
  return (
    <group ref={ref} position={[4.5,0,3]}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.005,0]}>
        <planeGeometry args={[7,7]} /><meshLambertMaterial color="#A8C480" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.005,0]}>
        <circleGeometry args={[3.2,16]} /><meshLambertMaterial color="#BCE494" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0.2,0.01,1.0]}>
        <planeGeometry args={[3.5,2.0]} /><meshLambertMaterial color="#D0C8A8" />
      </mesh>
      <B x={0.1} y={0.9} z={0} w={2.8} h={1.8} d={2.1} color={cream} />
      <HipRoof x={0.1} y={1.84} z={0} r={1.82} h={0.78} color={green} />
      <B x={0.1} y={1.82} z={0} w={3.0} h={0.1} d={2.3} color={dkGreen} shadow={false} />
      <B x={0.1} y={1.0} z={1.12} w={1.7} h={2.0} d={0.28} color={cream} />
      <B x={0.1} y={1.1} z={1.27} w={1.1} h={1.3} d={0.04} color="#7A8860" />
      <B x={0.1} y={0.55} z={1.27} w={1.0} h={0.2} d={0.04} color="#5A6A48" />
      <Cone x={0.1} y={2.09} z={1.12} r={1.0} h={0.52} sides={4} rotY={Math.PI/4} color={cream} />
      <B x={-1.55} y={1.95} z={0.65} w={0.52} h={3.9} d={0.52} color={cream} />
      <B x={-1.55} y={3.0} z={0.92} w={0.22} h={0.28} d={0.04} color="#8A9870" />
      <mesh position={[-1.55,3.98,0.65]} castShadow>
        <sphereGeometry args={[0.3,8,5,0,Math.PI*2,0,Math.PI*0.55]} />
        <meshLambertMaterial color={blue} />
      </mesh>
      <B x={-1.55} y={3.95} z={0.65} w={0.36} h={0.06} d={0.36} color={blue} shadow={false} />
      <B x={-1.55} y={4.42} z={0.65} w={0.06} h={0.38} d={0.06} color="#DCDCCC" />
      <B x={-1.55} y={4.52} z={0.65} w={0.2}  h={0.06} d={0.06} color="#DCDCCC" />
      <B x={1.85} y={0.65} z={0.0} w={0.85} h={1.3} d={1.9} color={dkCream} />
      <HipRoof x={1.85} y={1.35} z={0.0} r={1.05} h={0.5} color={green} />
      <B x={1.85} y={1.33} z={0.0} w={1.05} h={0.08} d={2.1} color={dkGreen} shadow={false} />
      <B x={1.85} y={0.65} z={ 0.6} w={0.04} h={1.1} d={0.18} color="#C8B88A" />
      <B x={1.85} y={0.65} z={-0.6} w={0.04} h={1.1} d={0.18} color="#C8B88A" />
      <B x={0.1} y={0.08} z={1.6}  w={2.4} h={0.16} d={0.42} color="#DDD5BC" />
      <B x={0.1} y={0.18} z={1.42} w={2.1} h={0.12} d={0.35} color="#D8D0BA" />
      <B x={0.1} y={0.26} z={1.28} w={1.8} h={0.10} d={0.3}  color="#D4CEB8" />
      <B x={1.5} y={0.7} z={1.8} w={0.07} h={1.4} d={0.07} color="#8A8070" />
      <mesh position={[1.5,1.45,1.8]} castShadow>
        <sphereGeometry args={[0.11,6,6]} />
        <meshLambertMaterial color="#FFE8B0" emissive="#FFE8B0" emissiveIntensity={0.3} />
      </mesh>
      <Tree x={-0.6} z={2.2} s={0.85} />
      <Tree x={0.9}  z={2.3} s={0.75} />
      <Palm x={-2.2} z={0.5} s={0.9} />
      <Palm x={2.5}  z={0.8} s={0.8} />
      <Tree x={2.5}  z={-1.5} s={1.0} />
      <Tree x={-2.3} z={-1.2} s={0.9} />
    </group>
  )
}

// ── Zone 2: Kinalas Food Trail (SW) ──────────────────────────────────────────
function KinalasZone({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (!ref.current) return
    ref.current.position.y += ((selected ? 0.2 : 0) - ref.current.position.y) * dt * 5
  })
  const wood  = '#5C3D28'; const dkWood  = '#3E2818'
  const metal = '#5A5652'; const dkMetal = '#3E3C38'
  const green = '#4A7A3A'
  return (
    <group ref={ref} position={[-4.5,0,3]}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.005,0]}>
        <planeGeometry args={[7,7]} /><meshLambertMaterial color="#A8906A" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.005,1.5]}>
        <planeGeometry args={[5.5,2.0]} /><meshLambertMaterial color="#B89E7A" />
      </mesh>
      {([ [-1.4,-0.9],[1.4,-0.9],[-1.4,0.8],[1.4,0.8],[-1.4,0.0],[1.4,0.0] ] as [number,number][]).map(([px,pz],i)=>(
        <mesh key={i} position={[px,0.65,pz]} castShadow>
          <cylinderGeometry args={[0.08,0.1,1.3,6]} />
          <meshLambertMaterial color={wood} />
        </mesh>
      ))}
      <B x={0} y={1.45} z={0} w={3.2} h={0.62} d={2.0} color={green} />
      {[1.2,1.35,1.5,1.6,1.72].map((hy,i)=>(
        <B key={i} x={0} y={hy} z={1.01} w={3.0} h={0.06} d={0.02} color={dkWood} shadow={false} />
      ))}
      <B x={0} y={1.86} z={0} w={4.9} h={0.18} d={3.9} color={metal} />
      <B x={0} y={1.96} z={0} w={4.7} h={0.06} d={0.35} color={dkMetal} shadow={false} />
      <B x={0} y={2.0}  z={0} w={4.5} h={0.1}  d={0.22} color={dkMetal} shadow={false} />
      <B x={0} y={1.80} z={2.0} w={5.1} h={0.1} d={0.14} color={dkMetal} shadow={false} />
      <B x={0} y={0.54} z={-0.7} w={2.8} h={0.1}  d={0.45} color="#8B6040" />
      <B x={0} y={0.32} z={-0.7} w={2.8} h={0.52} d={0.42} color={wood} />
      {[-0.8,-0.2,0.4,1.0].map((bx,i)=>(
        <mesh key={i} position={[bx,0.62,-0.7]} castShadow>
          <cylinderGeometry args={[0.1,0.08,0.1,8]} />
          <meshLambertMaterial color={i%2===0 ? '#F5F0E5' : '#E8DCC8'} />
        </mesh>
      ))}
      <B x={-0.6} y={0.2} z={0.35} w={0.45} h={0.4}  d={0.45} color="#E03030" />
      <B x={0.2}  y={0.2} z={0.35} w={0.45} h={0.4}  d={0.45} color="#E03030" />
      <B x={0.9}  y={0.2} z={0.45} w={0.45} h={0.35} d={0.45} color="#E03030" />
      <B x={-0.2} y={0.32} z={0.15} w={0.7} h={0.07} d={0.55} color="#CC2828" />
      {([[2.3,-0.7],[2.3,0.5],[3.3,-0.7],[3.3,0.5]] as [number,number][]).map(([px,pz],i)=>(
        <mesh key={i} position={[px,0.5,pz]} castShadow>
          <cylinderGeometry args={[0.07,0.08,1.0,5]} />
          <meshLambertMaterial color={wood} />
        </mesh>
      ))}
      <B x={2.8} y={1.1} z={-0.1} w={1.5} h={0.14} d={1.6} color="#7A5A38" />
      <Cone x={2.8} y={1.22} z={-0.1} r={0.95} h={0.55} sides={4} rotY={Math.PI/4} color={dkWood} />
      <B x={-2.1} y={0.88} z={1.6}  w={0.85} h={1.0} d={0.08} color={green} />
      <B x={-2.1} y={0.95} z={1.65} w={0.7}  h={0.7} d={0.04} color="#F5F0E5" />
      <B x={-2.1} y={0.42} z={1.62} w={0.08} h={0.84} d={0.08} color={wood} />
      <Tree x={2.2} z={1.5} s={0.7} />
      <Tree x={-2.2} z={1.2} s={0.65} />
      <Palm x={-2.5} z={-1.2} s={0.85} />
    </group>
  )
}

// ── Zone 3: Museo ni Jesse Robredo (NW) ──────────────────────────────────────
function RobredoZone({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (!ref.current) return
    ref.current.position.y += ((selected ? 0.2 : 0) - ref.current.position.y) * dt * 5
  })
  const woodSlat = '#8B5433'; const roofEdge = '#4A2E1A'
  const yellow   = '#E8B830'; const pave = '#C4BCA8'
  const arcSegs  = 11
  const arcR     = 2.1
  const arcStart = Math.PI / 2
  const arcTotal = Math.PI * 1.5
  const segBoxW  = (arcR * arcTotal / arcSegs) * 1.12
  return (
    <group ref={ref} position={[-4.5,0,-3]}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.005,0]}>
        <planeGeometry args={[7,7]} /><meshLambertMaterial color="#7AB460" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[-0.3,0.01,-0.3]}>
        <circleGeometry args={[1.9,16]} /><meshLambertMaterial color={pave} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[-0.3,0.015,-0.3]}>
        <ringGeometry args={[1.0,1.15,16]} /><meshLambertMaterial color="#B8B0A0" />
      </mesh>
      {Array.from({ length: arcSegs + 1 }, (_, i) => {
        const t = i / arcSegs
        const angle = arcStart + t * arcTotal
        const wx = Math.cos(angle) * arcR
        const wz = Math.sin(angle) * arcR
        return (
          <mesh key={i} position={[wx, 0.55, wz]} rotation={[0, -angle, 0]} castShadow>
            <boxGeometry args={[0.34, 1.1, segBoxW]} />
            <meshLambertMaterial color={woodSlat} />
          </mesh>
        )
      })}
      {Array.from({ length: arcSegs + 1 }, (_, i) => {
        const t = i / arcSegs
        const angle = arcStart + t * arcTotal
        const wx = Math.cos(angle) * arcR
        const wz = Math.sin(angle) * arcR
        return (
          <mesh key={i} position={[wx, 1.15, wz]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.42, 0.14, segBoxW + 0.08]} />
            <meshLambertMaterial color={roofEdge} />
          </mesh>
        )
      })}
      <B x={0.62} y={0.7} z={1.42} w={0.2} h={1.4} d={0.2} color={yellow} />
      <B x={1.42} y={0.7} z={0.62} w={0.2} h={1.4} d={0.2} color={yellow} />
      <B x={0.62} y={1.46} z={1.42} w={0.28} h={0.1} d={0.28} color={yellow} shadow={false} />
      <B x={1.42} y={1.46} z={0.62} w={0.28} h={0.1} d={0.28} color={yellow} shadow={false} />
      <B x={0.9} y={0.08} z={0.9} w={0.35} h={0.16} d={0.35} color="#A0988A" />
      <B x={0.9} y={0.4}  z={0.9} w={0.22} h={0.38} d={0.2}  color="#5A5650" />
      <mesh position={[0.9,0.65,0.9]} castShadow>
        <sphereGeometry args={[0.1,7,6]} />
        <meshLambertMaterial color="#8A7A68" />
      </mesh>
      <B x={0.95} y={0.08} z={1.72} w={1.05} h={0.16} d={0.45} color={pave} />
      <B x={0.95} y={0.20} z={1.52} w={0.90} h={0.12} d={0.4}  color="#B8B0A0" />
      <B x={0.95} y={0.30} z={1.36} w={0.78} h={0.10} d={0.35} color="#ACA498" />
      <B x={-0.3} y={0.8} z={-2.08} w={1.8} h={0.28} d={0.04} color={yellow} shadow={false} />
      <group position={[-0.5, 0, -0.4]} scale={1.5}>
        <B x={0} y={0.28} z={0} w={0.12} h={0.56} d={0.12} color="#5C3D28" />
        <Cone x={0} y={0.78} z={0} r={0.38} h={0.72} sides={7} color="#3D7254" />
        <Cone x={0} y={1.15} z={0} r={0.28} h={0.58} sides={7} color="#2D5A44" />
        <Cone x={0} y={1.45} z={0} r={0.18} h={0.44} sides={7} color="#254A38" />
      </group>
      <Tree x={-2.5} z={0.5}  s={1.15} />
      <Tree x={-1.8} z={-2.2} s={1.0}  />
      <Tree x={0.5}  z={-2.5} s={1.05} />
      <Tree x={2.3}  z={-1.5} s={0.85} />
    </group>
  )
}

// ── Zone 4: Mount Isarog (NE) ─────────────────────────────────────────────────
function IsarogZone({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (!ref.current) return
    ref.current.position.y += ((selected ? 0.2 : 0) - ref.current.position.y) * dt * 5
  })
  const forestDk = '#2A4E3A'; const forest  = '#315B43'
  const mid      = '#3D6840'; const rocky   = '#6E7E5A'
  const summit   = '#8A9A6A'
  return (
    <group ref={ref} position={[4.5,0,-3]}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.005,0]}>
        <planeGeometry args={[7,7]} /><meshLambertMaterial color="#7EC850" />
      </mesh>
      {[-2,-1,0,1,2].map((zi,i)=>(
        <mesh key={i} rotation={[-Math.PI/2,0,0]} position={[0,0.005,zi*0.8]}>
          <planeGeometry args={[6.5,0.06]} /><meshLambertMaterial color="#68B040" />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI/2,0,0]} position={[1.5,0.006,0]}>
        <planeGeometry args={[0.25,5]} /><meshLambertMaterial color="#8AAA60" />
      </mesh>
      <mesh position={[0,0.22,0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.8,4.2,0.44,14]} />
        <meshLambertMaterial color={mid} />
      </mesh>
      <Cone x={0}    y={1.1}  z={0}    r={3.5}  h={1.7}  sides={14} color={mid}      />
      <Cone x={-1.3} y={2.2}  z={-0.4} r={2.2}  h={1.9}  sides={12} color={forest}   />
      <Cone x={-1.3} y={3.7}  z={-0.4} r={1.2}  h={1.6}  sides={10} color={forestDk} />
      <Cone x={-1.3} y={5.0}  z={-0.4} r={0.65} h={1.2}  sides={9}  color={rocky}    />
      <Cone x={-1.3} y={5.9}  z={-0.4} r={0.32} h={0.75} sides={8}  color={summit}   />
      <mesh position={[-1.3,6.1,-0.4]}>
        <sphereGeometry args={[0.38,7,6]} />
        <meshLambertMaterial color="#D0E0CC" transparent opacity={0.4} />
      </mesh>
      <Cone x={1.4} y={2.0}  z={0.3}  r={1.8}  h={1.5}  sides={11} color={forest}   />
      <Cone x={1.4} y={3.2}  z={0.3}  r={1.0}  h={1.2}  sides={9}  color={forestDk} />
      <Cone x={1.4} y={4.2}  z={0.3}  r={0.48} h={0.85} sides={8}  color={rocky}    />
      <Cone x={1.4} y={4.82} z={0.3}  r={0.2}  h={0.45} sides={7}  color={summit}   />
      <mesh position={[0,3.5,-0.1]} castShadow>
        <sphereGeometry args={[0.9,8,6]} />
        <meshLambertMaterial color={forest} />
      </mesh>
      <Tree x={-3.0} z={0.5}  s={1.1}  /> <Tree x={-3.0} z={1.8}  s={0.95} />
      <Tree x={-2.2} z={2.5}  s={1.05} /> <Tree x={-0.8} z={2.8}  s={0.9}  />
      <Tree x={0.6}  z={2.9}  s={1.0}  /> <Tree x={2.0}  z={2.4}  s={1.05} />
      <Tree x={3.0}  z={1.2}  s={0.95} /> <Tree x={3.2}  z={-0.5} s={1.0}  />
      <Tree x={3.0}  z={-1.8} s={0.9}  /> <Tree x={2.0}  z={-2.5} s={1.0}  />
      <Tree x={0.2}  z={-2.8} s={0.85} /> <Tree x={-1.5} z={-2.5} s={0.9}  />
      <Tree x={-2.8} z={-1.5} s={1.0}  />
      <Palm x={1.8}  z={2.2}  s={1.1}  /> <Palm x={-1.0} z={2.6}  s={1.0}  />
      <Palm x={3.2}  z={0.2}  s={0.95} />
      <B x={-2.6} y={0.3} z={1.8} w={0.75} h={0.6} d={0.65} color="#9A6B4E" />
      <Cone x={-2.6} y={0.68} z={1.8} r={0.52} h={0.3} sides={4} rotY={Math.PI/4} color="#5C3D28" />
    </group>
  )
}

// ── Zone click target + label ─────────────────────────────────────────────────
function ZoneHitArea({ destId, position, name, icon, color, selected }: {
  destId: DestinationId; position: [number,number,number]
  name: string; icon: string; color: string; selected: boolean
}) {
  const { selectDestination } = useAppStore()
  const hov = useRef(false)
  const labelY = destId === 'isarog' ? 7.2 : destId === 'basilica' ? 5.2 : destId === 'robredo' ? 2.2 : 2.4

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.03,0]}
        onClick={e => { e.stopPropagation(); selectDestination(selected ? null : destId) }}
        onPointerOver={() => { hov.current=true;  document.body.style.cursor='pointer' }}
        onPointerOut={() =>  { hov.current=false; document.body.style.cursor='grab'   }}>
        <planeGeometry args={[7,7]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {selected && (
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.04,0]}>
          <ringGeometry args={[3.1,3.4,28]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}
      <Text
        position={[0, selected ? labelY+0.5 : labelY, 0]}
        fontSize={0.55}
        color="#F5F0E5"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#000000"
        outlineOpacity={0.6}
        fillOpacity={selected ? 1 : 0.88}
      >
        {name}
      </Text>
    </group>
  )
}

// ── Street trees at intersection ──────────────────────────────────────────────
function StreetTrees() {
  const pts: [number,number][] = [
    [1.6,0.8],[-1.6,0.8],[1.6,-0.8],[-1.6,-0.8],
    [0.8,1.6],[-0.8,1.6],[0.8,-1.6],[-0.8,-1.6],
  ]
  return <>{pts.map(([x,z],i)=><Tree key={i} x={x} z={z} s={0.65+(i%3)*0.08} />)}</>
}

// ── Surrounding city blocks ────────────────────────────────────────────────────
function SurroundingCity() {
  type HC = [number,number,number,string,string,number,number]
  const houses: HC[] = [
    [-9.0, 8.5,  Math.PI, '#E8DCCA','#7A3A2A', 1.2, 1.0],
    [-7.0, 8.1,  Math.PI, '#EDE0C8','#8B4A3A', 1.0, 0.9],
    [-5.2, 8.7,  Math.PI, '#DDD0B8','#703228', 1.15,0.95],
    [-3.2, 8.2,  Math.PI, '#E8D8C0','#7A4030', 1.3, 1.05],
    [-1.4, 8.6,  Math.PI, '#E4D8C8','#8B3820', 1.0, 0.9],
    [ 1.4, 8.2,  Math.PI, '#EAE0CC','#7A3A28', 1.1, 1.0],
    [ 3.2, 8.7,  Math.PI, '#E0D4C0','#703222', 1.2, 0.95],
    [ 5.2, 8.1,  Math.PI, '#E8DCC8','#8B4A3A', 1.0, 0.9],
    [ 7.0, 8.6,  Math.PI, '#EDE4D0','#7A3828', 1.1, 1.0],
    [ 9.0, 8.2,  Math.PI, '#E4D8C4','#6A3020', 1.2, 1.05],
    [-9.0,-8.5,  0,       '#DCCEC0','#7A3828', 1.2, 1.0],
    [-7.0,-8.1,  0,       '#E8DCC8','#8B4A3A', 1.0, 0.9],
    [-5.2,-8.7,  0,       '#E2D8C4','#703228', 1.15,0.95],
    [-3.2,-8.2,  0,       '#E8D4BC','#7A4030', 1.3, 1.0],
    [-1.4,-8.6,  0,       '#E4D8C8','#8B3820', 1.0, 0.9],
    [ 1.4,-8.2,  0,       '#EADEC8','#7A3A28', 1.1, 1.0],
    [ 3.2,-8.7,  0,       '#E0D4BC','#703222', 1.2, 0.95],
    [ 5.2,-8.1,  0,       '#E8DCC8','#8B4A3A', 1.0, 0.9],
    [ 7.0,-8.6,  0,       '#EDE4D0','#7A3828', 1.1, 1.0],
    [ 9.0,-8.2,  0,       '#E4D8C4','#6A3020', 1.2, 1.05],
    [ 9.4,-6.0, -Math.PI/2, '#E8DCCC','#7A3828', 1.1, 1.0],
    [ 9.2,-3.5, -Math.PI/2, '#E4D8C8','#8B4A3A', 1.2, 0.95],
    [ 9.5,-1.0, -Math.PI/2, '#EDE0CC','#7A4030', 1.0, 0.9],
    [ 9.3, 1.5, -Math.PI/2, '#E8D8C4','#8B3820', 1.1, 1.0],
    [ 9.4, 4.0, -Math.PI/2, '#E4DCCC','#7A3A28', 1.2, 0.95],
    [ 9.2, 6.5, -Math.PI/2, '#EADEC8','#703222', 1.0, 0.9],
    [-9.4,-6.0,  Math.PI/2, '#E4D8C0','#7A3828', 1.1, 1.0],
    [-9.2,-3.5,  Math.PI/2, '#E8DCC8','#8B4A3A', 1.2, 0.95],
    [-9.5,-1.0,  Math.PI/2, '#DCCEC0','#7A4030', 1.0, 0.9],
    [-9.3, 1.5,  Math.PI/2, '#E8D8C4','#8B3820', 1.1, 1.0],
    [-9.4, 4.0,  Math.PI/2, '#E4DCCC','#7A3A28', 1.2, 0.95],
    [-9.2, 6.5,  Math.PI/2, '#EADEC8','#703222', 1.0, 0.9],
  ]
  type SC = [number,number,number,string,string]
  const shops: SC[] = [
    [-8.6,  9.8, Math.PI,    '#D8CEBC','#6A3A2A'],
    [ 8.6,  9.8, Math.PI,    '#D4CAB8','#5A3020'],
    [-8.6, -9.8, 0,          '#D8CEBC','#6A3A2A'],
    [ 8.6, -9.8, 0,          '#D4CAB8','#5A3020'],
    [10.2,  0.0, -Math.PI/2, '#DCCEC0','#6A3428'],
    [-10.2, 0.0,  Math.PI/2, '#D8CEBC','#6A3428'],
  ]
  const outerTrees: [number,number,number][] = [
    [-10.2, 8.8,0.80],[10.2, 8.8,0.78],[-10.2,-8.8,0.82],[10.2,-8.8,0.75],
    [-6.0, 9.6,0.72],[6.0, 9.6,0.70],[-6.0,-9.6,0.74],[6.0,-9.6,0.71],
    [10.8, 4.2,0.70],[10.8,-4.2,0.72],[-10.8, 4.2,0.70],[-10.8,-4.2,0.73],
    [0.0, 9.9,0.68],[0.0,-9.9,0.69],
  ]
  return (
    <>
      {houses.map(([x,z,rot,wc,rc,sw,sd],i) => (
        <SmHouse key={`h${i}`} x={x} z={z} rot={rot} wc={wc} rc={rc} sw={sw} sd={sd} />
      ))}
      {shops.map(([x,z,rot,wc,rc],i) => (
        <ShopBuilding key={`s${i}`} x={x} z={z} rot={rot} wc={wc} rc={rc} />
      ))}
      {outerTrees.map(([x,z,s],i) => (
        <Tree key={`ot${i}`} x={x} z={z} s={s} />
      ))}
    </>
  )
}

// ── Vehicles ──────────────────────────────────────────────────────────────────
function Vehicles() {
  return (
    <>
      <Jeepney x={-7.5} z={ 0.35} rot={0}         body="#CC2222" stripe="#F0C040" />
      <Jeepney x={ 6.5} z={-0.32} rot={Math.PI}   body="#1A4499" stripe="#F0C040" />
      <Jeepney x={-2.0} z={ 4.35} rot={0}          body="#228844" stripe="#FFEE44" />
      <Car x={ 0.35} z={-6.5} rot={ Math.PI/2}  color="#884422" />
      <Car x={-0.32} z={ 7.8} rot={-Math.PI/2}  color="#3A6A99" />
      <Car x={-4.5}  z={-7.5} rot={ Math.PI/2}  color="#447744" />
      <Car x={ 4.5}  z={ 7.8} rot={-Math.PI/2}  color="#664488" />
      <Car x={-8.5}  z={-0.32} rot={0}           color="#557799" />
      <Car x={ 8.8}  z={ 0.35} rot={Math.PI}     color="#776655" />
      <Tricycle x={-3.2} z={4.9} rot={Math.PI*0.75} color="#FF8800" />
      <Tricycle x={ 3.6} z={5.1} rot={Math.PI*0.25} color="#EE7700" />
      <Car x={ 2.5}  z={-8.2} rot={-Math.PI/2}  color="#CC5544" />
    </>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export function CityMap() {
  const { selectedDestination, setLoading } = useAppStore()

  const zones = [
    { id:'basilica' as DestinationId, pos:[4.5,0,3]   as [number,number,number], name:'Basilica Minore', icon:'⛪', color:'#7B3038' },
    { id:'kinalas'  as DestinationId, pos:[-4.5,0,3]  as [number,number,number], name:'Kinalas Trail',   icon:'🍜', color:'#B96848' },
    { id:'robredo'  as DestinationId, pos:[-4.5,0,-3] as [number,number,number], name:'Robredo Museum',  icon:'🏛️', color:'#C29A51' },
    { id:'isarog'   as DestinationId, pos:[4.5,0,-3]  as [number,number,number], name:'Mt. Isarog',      icon:'🌿', color:'#315B43' },
  ]

  return (
    <Canvas orthographic
      camera={{ position:[20,20,20], zoom:ISO_ZOOM, near:0.1, far:200 }}
      gl={{ alpha: false }}
      shadows dpr={[1,1.5]}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0, 0, 0)
        gl.setClearColor(0x1A2535, 1)
        setTimeout(() => setLoading(false), 600)
      }}
      aria-label="Isometric map of Naga City"
    >
      <color attach="background" args={['#1A2535']} />
      <fog attach="fog" color="#1A2535" near={52} far={72} />

      {/* CameraController outside Suspense — always runs */}
      <CameraController />

      <Suspense fallback={null}>
        <Lighting />
        <Ground />
        <Fence />
        <StreetTrees />
        <SurroundingCity />
        <Vehicles />
        <BasilicaZone selected={selectedDestination === 'basilica'} />
        <KinalasZone  selected={selectedDestination === 'kinalas'} />
        <RobredoZone  selected={selectedDestination === 'robredo'} />
        <IsarogZone   selected={selectedDestination === 'isarog'} />
        {zones.map(z => (
          <ZoneHitArea key={z.id} destId={z.id} position={z.pos}
            name={z.name} icon={z.icon} color={z.color}
            selected={selectedDestination === z.id} />
        ))}
      </Suspense>
    </Canvas>
  )
}
