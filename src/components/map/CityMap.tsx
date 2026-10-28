import { Suspense, useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../../store/appStore'
import { destinations, type DestinationId } from '../../data/destinations'

// ── Shared helpers ─────────────────────────────────────────────────────────────
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

// Proper triangular-prism gabled roof
function GableRoof({ x=0, y=0, z=0, w=3, h=1.2, d=3, color='#2D6E2A' }:
  { x?:number; y?:number; z?:number; w?:number; h?:number; d?:number; color?:string }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const hw = w/2, hd = d/2
    const verts = new Float32Array([
      -hw, 0, -hd,   hw, 0, -hd,   0, h, -hd,   // front 0 1 2
      -hw, 0,  hd,   hw, 0,  hd,   0, h,  hd,   // back  3 4 5
    ])
    const idx = [
      0,2,1,  3,4,5,          // gable ends
      0,1,4,  0,4,3,          // bottom
      0,3,5,  0,5,2,          // left slope
      1,2,5,  1,5,4,          // right slope
    ]
    g.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    return g
  }, [w, h, d])
  return (
    <mesh position={[x, y, z]} geometry={geo} castShadow>
      <meshLambertMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Tree({ x=0, z=0, s=1 }: { x?:number; z?:number; s?:number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <B x={0} y={0.22} z={0} w={0.10} h={0.44} d={0.10} color="#5C3D28" />
      <Cone x={0} y={0.65} z={0} r={0.28} h={0.55} sides={6} color="#3D7254" />
      <Cone x={0} y={0.95} z={0} r={0.20} h={0.45} sides={6} color="#315B43" />
    </group>
  )
}

function Palm({ x=0, z=0, s=1 }: { x?:number; z?:number; s?:number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <B x={0} y={0.60} z={0} w={0.09} h={1.20} d={0.09} color="#6B4C30" />
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.32, 7, 5]} />
        <meshLambertMaterial color="#3D6840" />
      </mesh>
    </group>
  )
}

function PineTree({ x=0, z=0, s=1 }: { x?:number; z?:number; s?:number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <B x={0} y={0.13} z={0} w={0.08} h={0.26} d={0.08} color="#4A2E18" />
      <Cone x={0} y={0.52} z={0} r={0.30} h={0.48} sides={6} color="#2D6B3A" />
      <Cone x={0} y={0.78} z={0} r={0.22} h={0.40} sides={6} color="#255530" />
      <Cone x={0} y={0.98} z={0} r={0.15} h={0.34} sides={6} color="#1E4428" />
      <Cone x={0} y={1.15} z={0} r={0.09} h={0.26} sides={5} color="#183820" />
    </group>
  )
}

// ── Buildings ──────────────────────────────────────────────────────────────────
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
      <HipRoof x={0} y={1.26} z={0} r={1.06} h={0.60} color={rc} />
      <B x={0}     y={0.22} z={0.555} w={1.05} h={0.28} d={0.03} color="#B0C8D0" shadow={false} />
      <B x={ 0.35} y={0.75} z={0.555} w={0.24} h={0.20} d={0.03} color="#B0C8D0" shadow={false} />
      <B x={-0.05} y={0.75} z={0.555} w={0.24} h={0.20} d={0.03} color="#B0C8D0" shadow={false} />
      <B x={-0.45} y={0.75} z={0.555} w={0.24} h={0.20} d={0.03} color="#B0C8D0" shadow={false} />
    </group>
  )
}

function TallBuilding({ x=0, z=0, rot=0, wc='#D8D0C0', ac='#A89880', floors=3 }:
  { x?:number; z?:number; rot?:number; wc?:string; ac?:string; floors?:number }) {
  const fh = 0.52
  const bw = 1.5, bd = 1.1
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]}>
      <B x={0} y={floors*fh/2} z={0} w={bw} h={floors*fh} d={bd} color={wc} />
      {Array.from({ length: floors }, (_, f) => (
        <group key={f}>
          <B x={-0.30} y={(f+0.62)*fh} z={ bd/2+0.01} w={0.28} h={0.22} d={0.03} color="#A8C8D8" shadow={false} />
          <B x={ 0.30} y={(f+0.62)*fh} z={ bd/2+0.01} w={0.28} h={0.22} d={0.03} color="#A8C8D8" shadow={false} />
          <B x={-0.30} y={(f+0.62)*fh} z={-bd/2-0.01} w={0.28} h={0.22} d={0.03} color="#A8C8D8" shadow={false} />
          <B x={ 0.30} y={(f+0.62)*fh} z={-bd/2-0.01} w={0.28} h={0.22} d={0.03} color="#A8C8D8" shadow={false} />
        </group>
      ))}
      <B x={0} y={floors*fh+0.06} z={0} w={bw+0.14} h={0.12} d={bd+0.14} color={ac} shadow={false} />
    </group>
  )
}

// ── Vehicles ───────────────────────────────────────────────────────────────────
function Car({ x=0, z=0, rot=0, color='#446699' }:
  { x?:number; z?:number; rot?:number; color?:string }) {
  return (
    <group position={[x, 0.12, z]} rotation={[0, rot, 0]}>
      <B x={0}     y={0.10} z={0}      w={0.75} h={0.22} d={0.38} color={color} />
      <B x={-0.1}  y={0.27} z={0}      w={0.42} h={0.17} d={0.32} color={color} />
      <B x={ 0.10} y={0.27} z={0}      w={0.15} h={0.14} d={0.28} color="#C8E0EA" shadow={false} />
      <B x={-0.30} y={0.27} z={0}      w={0.08} h={0.12} d={0.24} color="#C8E0EA" shadow={false} />
      <B x={-0.06} y={0.29} z={ 0.17}  w={0.26} h={0.12} d={0.02} color="#C8E0EA" shadow={false} />
      <B x={-0.06} y={0.29} z={-0.17}  w={0.26} h={0.12} d={0.02} color="#C8E0EA" shadow={false} />
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
      <B x={0}     y={0.18} z={0}      w={1.42} h={0.36} d={0.58} color={body} />
      <B x={0.02}  y={0.38} z={0}      w={1.35} h={0.09} d={0.64} color={stripe} />
      <B x={0.60}  y={0.24} z={0}      w={0.24} h={0.30} d={0.54} color="#BB2020" />
      <B x={0.70}  y={0.27} z={0}      w={0.06} h={0.20} d={0.42} color="#B8D8E8" shadow={false} />
      <B x={-0.04} y={0.27} z={ 0.30}  w={0.90} h={0.14} d={0.02} color="#B8D8E8" shadow={false} />
      <B x={-0.04} y={0.27} z={-0.30}  w={0.90} h={0.14} d={0.02} color="#B8D8E8" shadow={false} />
      <B x={-0.05} y={0.19} z={ 0.30}  w={0.82} h={0.07} d={0.02} color={stripe} shadow={false} />
      <B x={-0.05} y={0.19} z={-0.30}  w={0.82} h={0.07} d={0.02} color={stripe} shadow={false} />
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

function Bus({ x=0, z=0, rot=0, color='#2244AA' }:
  { x?:number; z?:number; rot?:number; color?:string }) {
  return (
    <group position={[x, 0.18, z]} rotation={[0, rot, 0]}>
      <B x={0}    y={0.22} z={0}    w={2.60} h={0.44} d={0.72} color={color} />
      <B x={0}    y={0.47} z={0}    w={2.56} h={0.08} d={0.70} color={color} />
      <B x={1.22} y={0.22} z={0}    w={0.10} h={0.40} d={0.68} color="#1A3A88" />
      {([-0.90,-0.50,-0.10,0.30,0.70] as number[]).map((wx,i)=>(
        <B key={`fw${i}`} x={wx} y={0.28} z={ 0.37} w={0.28} h={0.18} d={0.03} color="#B8D8E8" shadow={false} />
      ))}
      {([-0.90,-0.50,-0.10,0.30,0.70] as number[]).map((wx,i)=>(
        <B key={`bw${i}`} x={wx} y={0.28} z={-0.37} w={0.28} h={0.18} d={0.03} color="#B8D8E8" shadow={false} />
      ))}
      {([[-1.00,-0.28],[-1.00,0.28],[1.00,-0.28],[1.00,0.28]] as [number,number][]).map(([wx,wz],i)=>(
        <mesh key={i} position={[wx,-0.14,wz]} rotation={[0,0,Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.13,0.13,0.15,8]} />
          <meshLambertMaterial color="#222" />
        </mesh>
      ))}
    </group>
  )
}

// ── Lamp post ──────────────────────────────────────────────────────────────────
function LampPost({ x=0, z=0 }: { x?:number; z?:number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.30, 0]} castShadow>
        <cylinderGeometry args={[0.038, 0.055, 2.60, 7]} />
        <meshLambertMaterial color="#5A5A6A" />
      </mesh>
      {/* Horizontal arm */}
      <B x={0.24} y={2.64} z={0} w={0.48} h={0.038} d={0.038} color="#4A4A58" shadow={false} />
      <B x={0.48} y={2.52} z={0} w={0.038} h={0.28} d={0.038} color="#4A4A58" shadow={false} />
      {/* Lantern housing */}
      <mesh position={[0.48, 2.36, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.070, 0.18, 8]} />
        <meshLambertMaterial color="#303040" />
      </mesh>
      <mesh position={[0.48, 2.47, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.04, 8]} />
        <meshLambertMaterial color="#282830" />
      </mesh>
      {/* Emissive glow bulb */}
      <mesh position={[0.48, 2.28, 0]}>
        <sphereGeometry args={[0.062, 7, 6]} />
        <meshLambertMaterial color="#FFFCE0" emissive="#FFE060" emissiveIntensity={0.55} />
      </mesh>
    </group>
  )
}

function StreetLamps() {
  const lamps: [number, number][] = [
    // N-S main road — east side
    [ 0.92, -10], [ 0.92, -5], [ 0.92, 5], [ 0.92, 10],
    // E-W main road — south side
    [-10, -0.92], [-5, -0.92], [5, -0.92], [10, -0.92],
    // Plaza corner lamps
    [ 0.92, 0], [-0.92, 0],
  ]
  return (
    <>{lamps.map(([x,z],i) => <LampPost key={`lp${i}`} x={x} z={z} />)}</>
  )
}

// ── Isometric camera constants ─────────────────────────────────────────────────
const ISO_ZOOM = 30

function CameraController() {
  const { selectedDestination } = useAppStore()
  const { camera, gl } = useThree()

  const cx = useRef(0), cz = useRef(0)
  const tx = useRef(0), tz = useRef(0)
  const tZoom = useRef(ISO_ZOOM)

  const panX    = useRef(0), panZ    = useRef(0)
  const isDown  = useRef(false)
  const startXY = useRef({ x:0, y:0 })
  const lastXY  = useRef({ x:0, y:0 })
  const isPanning = useRef(false)
  const MAX_PAN = 20

  useEffect(() => {
    if (selectedDestination) {
      const dest = destinations.find(d => d.id === selectedDestination)
      if (dest) {
        // Use actual world position so the selected zone is centered
        tx.current = dest.scene3dPos[0]
        tz.current = dest.scene3dPos[2]
        tZoom.current = dest.id === 'isarog' ? 40 : 85
      }
    } else {
      tx.current = 0; tz.current = -5; tZoom.current = ISO_ZOOM
    }
    panX.current = 0; panZ.current = 0
  }, [selectedDestination])

  useEffect(() => {
    const el = gl.domElement
    el.style.cursor = 'grab'
    const onDown = (e: PointerEvent) => {
      isDown.current = true; isPanning.current = false
      startXY.current = { x:e.clientX, y:e.clientY }
      lastXY.current  = { x:e.clientX, y:e.clientY }
      el.style.cursor = 'grabbing'
    }
    const onMove = (e: PointerEvent) => {
      if (!isDown.current) return
      const dist = Math.hypot(e.clientX-startXY.current.x, e.clientY-startXY.current.y)
      const dx = e.clientX - lastXY.current.x
      const dy = e.clientY - lastXY.current.y
      lastXY.current = { x:e.clientX, y:e.clientY }
      if (dist > 4 || isPanning.current) {
        isPanning.current = true
        const zoom  = (camera as THREE.OrthographicCamera).zoom
        const scale = 1.2 / zoom
        panX.current = THREE.MathUtils.clamp(panX.current - 0.707*(dx+dy)*scale, -MAX_PAN, MAX_PAN)
        panZ.current = THREE.MathUtils.clamp(panZ.current + 0.707*(dx-dy)*scale, -MAX_PAN, MAX_PAN)
      }
    }
    const onUp = () => { isDown.current=false; isPanning.current=false; el.style.cursor='grab' }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const step = Math.sign(e.deltaY) * 4
      tZoom.current = THREE.MathUtils.clamp(tZoom.current - step, 12, 100)
    }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    el.addEventListener('wheel', onWheel, { passive:false })
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
    camera.position.set(20 + cx.current, 20, 20 + cz.current)
    camera.lookAt(cx.current, 0, cz.current)
    const o = camera as THREE.OrthographicCamera
    o.zoom += (tZoom.current - o.zoom) * f
    o.updateProjectionMatrix()
  })
  return null
}

// ── Lighting ───────────────────────────────────────────────────────────────────
function Lighting() {
  return (
    <>
      <ambientLight color="#F5EDD8" intensity={0.9} />
      <directionalLight color="#FFF5E0" intensity={2.8} position={[12,22,8]}
        castShadow shadow-mapSize={[2048,2048]}
        shadow-camera-far={320}
        shadow-camera-left={-55} shadow-camera-right={55}
        shadow-camera-top={55}   shadow-camera-bottom={-55} />
      <directionalLight color="#C8D8E8" intensity={0.5} position={[-8,10,-6]} />
    </>
  )
}

// ── Quince Martires Monument ───────────────────────────────────────────────────
function QuinceMartiresMonument() {
  const bronze = '#8B6A3A'
  const cream  = '#E8E0CC'
  const gold   = '#C29A51'
  const marble = '#F0EAD8'
  return (
    <group>
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.74, 0.80, 0.14, 14]} />
        <meshLambertMaterial color={marble} />
      </mesh>
      <mesh position={[0, 0.20, 0]} castShadow>
        <cylinderGeometry args={[0.60, 0.74, 0.14, 14]} />
        <meshLambertMaterial color={marble} />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.60, 0.28, 12]} />
        <meshLambertMaterial color={cream} />
      </mesh>
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.04, 12]} />
        <meshLambertMaterial color={gold} />
      </mesh>
      <mesh position={[0, 0.74, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.46, 0.38, 12]} />
        <meshLambertMaterial color={cream} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a)*0.33, 0.74, Math.sin(a)*0.33]}>
            <cylinderGeometry args={[0.055, 0.055, 0.02, 8]} />
            <meshLambertMaterial color={gold} />
          </mesh>
        )
      })}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.05, 12]} />
        <meshLambertMaterial color={gold} />
      </mesh>
      {/* Eagle at front */}
      <mesh position={[0, 0.72, 0.34]} castShadow>
        <sphereGeometry args={[0.10, 6, 5]} />
        <meshLambertMaterial color={bronze} />
      </mesh>
      <B x={-0.12} y={0.72} z={0.38} w={0.18} h={0.04} d={0.06} color={bronze} shadow={false} />
      <B x={ 0.12} y={0.72} z={0.38} w={0.18} h={0.04} d={0.06} color={bronze} shadow={false} />
      {/* 4 bronze figures */}
      {([0, Math.PI/2, Math.PI, -Math.PI/2] as number[]).map((a, i) => (
        <group key={i} position={[Math.cos(a)*0.38, 0.58, Math.sin(a)*0.38]} rotation={[0, -a+Math.PI, 0]}>
          <mesh position={[0, 0.10, 0]} castShadow>
            <cylinderGeometry args={[0.040, 0.046, 0.20, 6]} />
            <meshLambertMaterial color={bronze} />
          </mesh>
          <mesh position={[0, 0.26, 0]} castShadow>
            <sphereGeometry args={[0.044, 6, 5]} />
            <meshLambertMaterial color={bronze} />
          </mesh>
          <B x={0} y={0.20} z={-0.06} w={0.025} h={0.16} d={0.025} color={bronze} shadow={false} />
        </group>
      ))}
      {/* Main central statue */}
      <mesh position={[0, 1.18, 0]} castShadow>
        <cylinderGeometry args={[0.052, 0.060, 0.28, 7]} />
        <meshLambertMaterial color={bronze} />
      </mesh>
      <mesh position={[0, 1.52, 0]} castShadow>
        <sphereGeometry args={[0.062, 7, 6]} />
        <meshLambertMaterial color={bronze} />
      </mesh>
      <B x={0.10} y={1.38} z={0} w={0.18} h={0.030} d={0.030} color={bronze} shadow={false} />
      <B x={0.22} y={1.56} z={0} w={0.030} h={0.20} d={0.030} color={bronze} shadow={false} />
      <mesh position={[0.22, 1.70, 0]}>
        <sphereGeometry args={[0.034, 5, 4]} />
        <meshLambertMaterial color="#FFD060" emissive="#FF8800" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// ── Zone 0: Plaza Quince Martires (center) ─────────────────────────────────────
function QuinceMartiresZone({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (!ref.current) return
    ref.current.position.y += ((selected ? 0.2 : 0) - ref.current.position.y) * dt * 5
  })
  return (
    <group ref={ref} position={[7, 0, -5]}>
      <group scale={[2.0, 2.0, 2.0]}>
        <QuinceMartiresMonument />
      </group>
    </group>
  )
}

// ── Ground + roads ─────────────────────────────────────────────────────────────
function Ground() {
  return (
    <group>
      {/* Main city ground */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]} receiveShadow>
        <planeGeometry args={[34,34]} />
        <meshLambertMaterial color="#CEC2A4" />
      </mesh>
      {/* North terrain extension — covers full mountain footprint at z=-26±17 */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.003,-26]} receiveShadow>
        <planeGeometry args={[34,34]} />
        <meshLambertMaterial color="#C8BC9C" />
      </mesh>
      {/* Unified platform base — covers city + mountain area as one board */}
      <B x={0} y={-0.20} z={-13} w={34.4} h={0.26} d={60} color="#9E8E6E" shadow={false} />

      {/* Main cross roads */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.01,0]}>
        <planeGeometry args={[1.5,34]} /><meshLambertMaterial color="#B0A890" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.01,0]}>
        <planeGeometry args={[34,1.5]} /><meshLambertMaterial color="#B0A890" />
      </mesh>

      {/* Road centre dashes */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={`dz${i}`} rotation={[-Math.PI/2,0,0]} position={[0, 0.015, -14 + i*2]}>
          <planeGeometry args={[0.06, 0.8]} /><meshLambertMaterial color="#E8E0C8" />
        </mesh>
      ))}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={`dx${i}`} rotation={[-Math.PI/2,0,0]} position={[-14 + i*2, 0.015, 0]}>
          <planeGeometry args={[0.8, 0.06]} /><meshLambertMaterial color="#E8E0C8" />
        </mesh>
      ))}

      {/* Secondary streets */}
      {([-5.2, 5.2] as number[]).map((sx,i) => (
        <mesh key={`sx${i}`} rotation={[-Math.PI/2,0,0]} position={[sx,0.013,0]}>
          <planeGeometry args={[0.75,34]} /><meshLambertMaterial color="#C0B59C" />
        </mesh>
      ))}
      {([-4.8, 4.8] as number[]).map((sz,i) => (
        <mesh key={`sz${i}`} rotation={[-Math.PI/2,0,0]} position={[0,0.013,sz]}>
          <planeGeometry args={[34,0.75]} /><meshLambertMaterial color="#C0B59C" />
        </mesh>
      ))}

      {/* Central plaza */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.02,0]}>
        <circleGeometry args={[2.2,18]} /><meshLambertMaterial color="#D8CEB2" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.025,0]}>
        <ringGeometry args={[2.02,2.22,18]} /><meshLambertMaterial color="#C29A51" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      {/* Paving stones */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <mesh key={`pv${i}`} rotation={[-Math.PI/2,0,0]} position={[Math.cos(a)*1.5, 0.026, Math.sin(a)*1.5]}>
            <planeGeometry args={[0.30, 0.18]} /><meshLambertMaterial color="#D0C8B0" />
          </mesh>
        )
      })}
      {/* Plaza paths from center in 4 directions */}
      {([0, Math.PI/2, Math.PI, -Math.PI/2] as number[]).map((a,i) => (
        <mesh key={`pp${i}`} rotation={[-Math.PI/2,0,0]} position={[Math.cos(a)*3.5, 0.019, Math.sin(a)*3.5]}>
          <planeGeometry args={[0.9, 4.2]} />
          <meshLambertMaterial color="#D0C4A0" />
        </mesh>
      ))}
    </group>
  )
}

// ── Welcome Arch ───────────────────────────────────────────────────────────────
function WelcomeArch() {
  const stone = '#C8BEAC', gold = '#C29A51', maroon = '#7B3038'
  return (
    <group position={[0, 0, 13.5]}>
      <mesh position={[-1.12, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 2.30, 10]} />
        <meshLambertMaterial color={stone} />
      </mesh>
      <B x={-1.12} y={2.42} z={0} w={0.56} h={0.18} d={0.56} color={gold} shadow={false} />
      <mesh position={[1.12, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 2.30, 10]} />
        <meshLambertMaterial color={stone} />
      </mesh>
      <B x={1.12} y={2.42} z={0} w={0.56} h={0.18} d={0.56} color={gold} shadow={false} />
      <B x={0} y={2.58} z={0} w={3.10} h={0.38} d={0.52} color={stone} />
      <B x={0} y={2.82} z={0} w={2.95} h={0.10} d={0.54} color={gold} shadow={false} />
      <B x={0} y={2.40} z={0} w={3.05} h={0.08} d={0.54} color={gold} shadow={false} />
      <mesh position={[-1.12, 3.0, 0]} castShadow>
        <sphereGeometry args={[0.11, 7, 6]} /><meshLambertMaterial color={gold} />
      </mesh>
      <mesh position={[1.12, 3.0, 0]} castShadow>
        <sphereGeometry args={[0.11, 7, 6]} /><meshLambertMaterial color={gold} />
      </mesh>
      <mesh position={[0, 3.08, 0]} castShadow>
        <sphereGeometry args={[0.14, 7, 6]} /><meshLambertMaterial color={gold} />
      </mesh>
      <Text position={[0, 2.60, 0.28]} fontSize={0.235} color={maroon}
        anchorX="center" anchorY="middle" outlineWidth={0.022} outlineColor="#F5F0E5" outlineOpacity={0.9} maxWidth={2.6}>
        Welcome to Naga City
      </Text>
      <Text position={[0, 2.60, -0.28]} rotation={[0, Math.PI, 0]} fontSize={0.22} color={maroon}
        anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#F5F0E5" outlineOpacity={0.8} maxWidth={2.6}>
        LAKAW NAGA
      </Text>
    </group>
  )
}

// ── Perimeter fence ────────────────────────────────────────────────────────────
function Fence() {
  const H = 13.5, STEP = 1.5, GATE = 1.1
  const pc = '#7A5030', rc = '#9A6A48'
  const posts: [number,number][] = []
  for (let v = -H; v <= H + 0.01; v += STEP) {
    if (Math.abs(v) > GATE) { posts.push([v,-H]); posts.push([v,H]) }
  }
  for (let v = -H + STEP; v < H; v += STEP) {
    if (Math.abs(v) > GATE) { posts.push([-H,v]); posts.push([H,v]) }
  }
  const seg = H - GATE, cx1 = -(H+GATE)/2, cx2 = (H+GATE)/2
  type RS = [number,number,number,number,number]
  const rails: RS[] = [
    [cx1,0.36,-H,seg,0.06],[cx1,0.20,-H,seg,0.06],[cx2,0.36,-H,seg,0.06],[cx2,0.20,-H,seg,0.06],
    [cx1,0.36, H,seg,0.06],[cx1,0.20, H,seg,0.06],[cx2,0.36, H,seg,0.06],[cx2,0.20, H,seg,0.06],
  ]
  const railsZ: RS[] = [
    [-H,0.36,cx1,0.06,seg],[-H,0.20,cx1,0.06,seg],[-H,0.36,cx2,0.06,seg],[-H,0.20,cx2,0.06,seg],
    [ H,0.36,cx1,0.06,seg],[ H,0.20,cx1,0.06,seg],[ H,0.36,cx2,0.06,seg],[ H,0.20,cx2,0.06,seg],
  ]
  return (
    <group>
      {posts.map(([px,pz],i) => <B key={`fp${i}`} x={px} y={0.22} z={pz} w={0.12} h={0.44} d={0.12} color={pc} />)}
      {[...rails,...railsZ].map(([cx,ry,cz,w,d],i) => (
        <B key={`fr${i}`} x={cx} y={ry} z={cz} w={w} h={0.05} d={d} color={rc} shadow={false} />
      ))}
    </group>
  )
}

// ── Walking People ─────────────────────────────────────────────────────────────
function WalkingPerson({ path, speed=1.0, offset=0, shirtColor='#4488CC', skinColor='#D4A874' }:
  { path:[number,number][]; speed?:number; offset?:number; shirtColor?:string; skinColor?:string }) {
  const ref  = useRef<THREE.Group>(null)
  const t    = useRef(offset % 1)
  const legT = useRef(offset * 6)
  useFrame((_, dt) => {
    t.current    = (t.current    + dt * speed * 0.12) % 1
    legT.current = (legT.current + dt * speed * 4.0) % (Math.PI * 2)
    const n = path.length, pos = t.current * (n - 1)
    const i0 = Math.min(Math.floor(pos), n - 2)
    const f = pos - i0
    const [x1,z1] = path[i0], [x2,z2] = path[i0+1]
    if (!ref.current) return
    ref.current.position.set(x1+(x2-x1)*f, 0, z1+(z2-z1)*f)
    const dx = x2-x1, dz = z2-z1
    if (Math.abs(dx)+Math.abs(dz) > 0.001) ref.current.rotation.y = Math.atan2(dx, dz)
    const swing = Math.sin(legT.current) * 0.18
    ;(ref.current.children[0] as THREE.Mesh).rotation.x =  swing
    ;(ref.current.children[1] as THREE.Mesh).rotation.x = -swing
  })
  return (
    <group ref={ref}>
      <mesh position={[-0.045, 0.13, 0]} castShadow>
        <boxGeometry args={[0.065, 0.26, 0.065]} /><meshLambertMaterial color="#3A3A3A" />
      </mesh>
      <mesh position={[0.045, 0.13, 0]} castShadow>
        <boxGeometry args={[0.065, 0.26, 0.065]} /><meshLambertMaterial color="#3A3A3A" />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.14, 0.19, 0.10]} /><meshLambertMaterial color={shirtColor} />
      </mesh>
      <mesh position={[0, 0.51, 0]} castShadow>
        <sphereGeometry args={[0.075, 7, 6]} /><meshLambertMaterial color={skinColor} />
      </mesh>
    </group>
  )
}

function WalkingPeople() {
  const defs = [
    // Main N-S road — sidewalks clear of perimeter buildings
    { path:[[ 0.40, 10],[ 0.40,-10]] as [number,number][], speed:0.48, offset:0.05, shirt:'#4488CC', skin:'#D4A874' },
    { path:[[-0.38,-10],[-0.38, 10]] as [number,number][], speed:0.55, offset:0.55, shirt:'#CC4444', skin:'#C49060' },
    // Main E-W road — sidewalks clear of east/west column buildings
    { path:[[-10, -0.38],[ 10,-0.38]] as [number,number][], speed:0.50, offset:0.25, shirt:'#44AA66', skin:'#E0B88A' },
    { path:[[ 10,  0.38],[-10, 0.38]] as [number,number][], speed:0.42, offset:0.72, shirt:'#BB6622', skin:'#D4A874' },
    // Secondary N-S roads — stop before perimeter building row at z=±10
    { path:[[-5.2,-8],[-5.2, 8]] as [number,number][], speed:0.52, offset:0.18, shirt:'#8844CC', skin:'#C49060' },
    { path:[[ 5.2, 8],[ 5.2,-8]] as [number,number][], speed:0.46, offset:0.62, shirt:'#22AAAA', skin:'#D4A874' },
    // Secondary E-W roads — stop before east/west column buildings at x=±11
    { path:[[-10, 4.8],[ 10, 4.8]] as [number,number][], speed:0.50, offset:0.35, shirt:'#CC8844', skin:'#E0B88A' },
    { path:[[ 10,-4.8],[-10,-4.8]] as [number,number][], speed:0.44, offset:0.80, shirt:'#6688CC', skin:'#C49060' },
    // Short central paths
    { path:[[ 0.40, 5],[ 0.40,-5]] as [number,number][], speed:0.55, offset:0.42, shirt:'#DD4488', skin:'#D4A874' },
    { path:[[-5.2, 0],[ 5.2, 0]] as [number,number][], speed:0.48, offset:0.68, shirt:'#44BB44', skin:'#E0B88A' },
    // Corner paths routed along proper road intersections
    { path:[[ 0.40, 8],[0.40, 4.8],[10, 4.8]] as [number,number][], speed:0.40, offset:0.10, shirt:'#FF8822', skin:'#C49060' },
    { path:[[-0.40,-8],[-0.40,-4.8],[-10,-4.8]] as [number,number][], speed:0.46, offset:0.50, shirt:'#2288EE', skin:'#D4A874' },
  ]
  return (
    <>{defs.map((d,i) => (
      <WalkingPerson key={i} path={d.path} speed={d.speed} offset={d.offset} shirtColor={d.shirt} skinColor={d.skin} />
    ))}</>
  )
}

// ── Our Lady of Peñafrancia statue ────────────────────────────────────────────
function PenafranciaStat() {
  const gold   = '#D4A020', goldDk = '#B88018', goldLt = '#F0C840'
  const skin   = '#D4A874', copper = '#8B5C3A'
  return (
    <group>
      {/* Pedestal base */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.32, 10]} />
        <meshLambertMaterial color={copper} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 10]} />
        <meshLambertMaterial color={goldLt} />
      </mesh>
      {/* Flared mantle hem — signature wide golden bell */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.46, 0.20, 8]} />
        <meshLambertMaterial color={gold} />
      </mesh>
      {/* Golden robe body */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.10, 0.28, 1.10, 8]} />
        <meshLambertMaterial color={gold} />
      </mesh>
      {/* Brocade rings */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.30, 0.30, 0.05, 8]} />
        <meshLambertMaterial color={goldLt} />
      </mesh>
      <mesh position={[0, 0.80, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 8]} />
        <meshLambertMaterial color={goldLt} />
      </mesh>
      <mesh position={[0, 1.10, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.04, 8]} />
        <meshLambertMaterial color={goldLt} />
      </mesh>
      {/* Upper torso */}
      <mesh position={[0, 1.30, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.105, 0.22, 8]} />
        <meshLambertMaterial color={gold} />
      </mesh>
      {/* Child Jesus — small figure at right of chest */}
      <mesh position={[0.13, 1.32, 0.08]} castShadow>
        <sphereGeometry args={[0.042, 6, 5]} />
        <meshLambertMaterial color={skin} />
      </mesh>
      <mesh position={[0.11, 1.22, 0.08]}>
        <cylinderGeometry args={[0.030, 0.038, 0.12, 6]} />
        <meshLambertMaterial color={goldDk} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.54, 0]} castShadow>
        <sphereGeometry args={[0.096, 8, 7]} />
        <meshLambertMaterial color={skin} />
      </mesh>
      {/* Halo disc behind head */}
      <mesh position={[0, 1.57, -0.07]}>
        <circleGeometry args={[0.20, 12]} />
        <meshLambertMaterial color={gold} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      {/* Crown ring */}
      <mesh position={[0, 1.66, 0]}>
        <torusGeometry args={[0.14, 0.022, 5, 12]} />
        <meshLambertMaterial color={goldLt} emissive={goldLt} emissiveIntensity={0.15} />
      </mesh>
      {/* Sunburst spikes × 12 — alternating long/short */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        const r  = i % 2 === 0 ? 0.22 : 0.17
        const h  = i % 2 === 0 ? 0.16 : 0.10
        return (
          <mesh key={i} position={[Math.cos(a)*r, 1.67, Math.sin(a)*r]}>
            <cylinderGeometry args={[0.005, 0.014, h, 4]} />
            <meshLambertMaterial color={goldLt} />
          </mesh>
        )
      })}
    </group>
  )
}

function PenafranciaPedestal({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.position.set(0.2, 7.0, 0.5)
    ref.current.scale.setScalar(0)
  }, [])
  useFrame((state, dt) => {
    if (!ref.current) return
    const target = selected ? 1.8 : 0.0
    const curr = ref.current.scale.x
    ref.current.scale.setScalar(curr + (target - curr) * dt * 7)
    const t = Math.min(curr / 1.8, 1)
    ref.current.position.y = 7.0 + Math.sin(state.clock.elapsedTime * 1.2) * 0.15 * t
  })
  return (
    <group ref={ref}>
      <PenafranciaStat />
    </group>
  )
}

// ── Zone 1: Basilica Minore (SE) — proper church architecture ─────────────────
function BasilicaZone({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (!ref.current) return
    ref.current.position.y += ((selected ? 0.2 : 0) - ref.current.position.y) * dt * 5
  })
  const cream = '#F0E8C0', dkCream = '#E8D8A8'
  const greenR = '#1A5EA8', white = '#FAFAF0', blue = '#2255AA', glass = '#5888C8'

  return (
    <group ref={ref} position={[7,0,6]}>
      {/* Ground */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.005,0]}>
        <planeGeometry args={[9.5,9.5]} /><meshLambertMaterial color="#A8C870" />
      </mesh>
      {/* Front plaza — cross path */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.01,2.8]}>
        <planeGeometry args={[1.0,4.2]} /><meshLambertMaterial color="#C8C0A8" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.012,2.8]}>
        <planeGeometry args={[3.8,0.85]} /><meshLambertMaterial color="#C8C0A8" />
      </mesh>

      {/* ── Main nave body ── */}
      <B x={0.2} y={1.0} z={-0.3} w={3.4} h={2.0} d={3.8} color={cream} />
      {/* Green gabled roof */}
      <GableRoof x={0.2} y={2.06} z={-0.3} w={3.8} h={1.65} d={4.2} color={greenR} />
      {/* Roof ridge cap — matches blue roof */}
      <B x={0.2} y={3.73} z={-0.3} w={4.0} h={0.10} d={0.24} color="#1A5EA8" shadow={false} />

      {/* ── Front gable facade ── */}
      <B x={0.2} y={1.65} z={1.74} w={3.1} h={3.30} d={0.20} color={white} />
      {/* Pointed gable cap */}
      <Cone x={0.2} y={3.48} z={1.74} r={1.72} h={1.30} sides={4} rotY={Math.PI/4} color={white} />
      {/* Cross on facade */}
      <B x={0.2} y={4.48} z={1.74} w={0.05} h={0.58} d={0.05} color={white} />
      <B x={0.2} y={4.70} z={1.74} w={0.26} h={0.05} d={0.05} color={white} />

      {/* ── Large arched stained-glass window ── */}
      <B x={0.2}  y={1.34} z={1.86} w={1.80} h={1.20} d={0.07} color={glass} shadow={false} />
      <mesh position={[0.2, 2.55, 1.86]}>
        <circleGeometry args={[0.90, 14, 0, Math.PI]} />
        <meshLambertMaterial color={glass} transparent opacity={0.76} />
      </mesh>
      {/* White arch frame */}
      <mesh position={[0.2, 2.55, 1.88]}>
        <torusGeometry args={[0.90, 0.065, 5, 14, Math.PI]} />
        <meshLambertMaterial color={white} />
      </mesh>
      <B x={-0.70} y={1.68} z={1.87} w={0.10} h={1.74} d={0.07} color={white} shadow={false} />
      <B x={ 1.10} y={1.68} z={1.87} w={0.10} h={1.74} d={0.07} color={white} shadow={false} />
      <B x={0.2}   y={0.76} z={1.87} w={2.00} h={0.12} d={0.07} color={white} shadow={false} />
      {/* Center mullion */}
      <B x={0.2} y={1.84} z={1.87} w={0.04} h={1.22} d={0.04} color={white} shadow={false} />
      <B x={0.2} y={1.50} z={1.87} w={1.80} h={0.04} d={0.04} color={white} shadow={false} />
      <B x={0.2} y={1.85} z={1.87} w={1.80} h={0.04} d={0.04} color={white} shadow={false} />

      {/* ── Very tall slender bell tower (left) ── */}
      <B x={-1.90} y={2.80} z={0.90} w={0.82} h={5.60} d={0.82} color={cream} />
      {/* Tower pilasters (corner strips) */}
      <B x={-2.32} y={2.80} z={0.90} w={0.12} h={5.60} d={0.94} color={dkCream} />
      <B x={-1.48} y={2.80} z={0.90} w={0.12} h={5.60} d={0.94} color={dkCream} />
      {/* Vertical glass panel */}
      <B x={-1.90} y={3.70} z={1.34} w={0.28} h={3.00} d={0.06} color="#4070A8" shadow={false} />
      {/* Tower belfry collar */}
      <B x={-1.90} y={5.72} z={0.90} w={0.98} h={0.24} d={0.98} color={dkCream} />
      {/* Blue dome */}
      <mesh position={[-1.90, 6.04, 0.90]} castShadow>
        <sphereGeometry args={[0.40, 10, 7, 0, Math.PI*2, 0, Math.PI*0.58]} />
        <meshLambertMaterial color={blue} />
      </mesh>
      <B x={-1.90} y={6.01} z={0.90} w={0.52} h={0.08} d={0.52} color={blue} shadow={false} />
      {/* Bell tower cross */}
      <B x={-1.90} y={6.62} z={0.90} w={0.05} h={0.58} d={0.05} color={white} />
      <B x={-1.90} y={6.84} z={0.90} w={0.26} h={0.05} d={0.05} color={white} />

      {/* ── Secondary dome (right of facade) ── */}
      <B x={0.85} y={1.68} z={1.60} w={0.72} h={1.64} d={0.72} color={cream} />
      <B x={0.85} y={2.58} z={1.60} w={0.64} h={0.20} d={0.64} color={dkCream} />
      <mesh position={[0.85, 2.82, 1.60]} castShadow>
        <sphereGeometry args={[0.32, 9, 7, 0, Math.PI*2, 0, Math.PI*0.56]} />
        <meshLambertMaterial color={blue} />
      </mesh>
      <B x={0.85} y={3.22} z={1.60} w={0.05} h={0.40} d={0.05} color={white} />
      <B x={0.85} y={3.37} z={1.60} w={0.18} h={0.05} d={0.05} color={white} />

      {/* ── Entry porch arcade ── */}
      <B x={0.2} y={0.56} z={2.10} w={2.80} h={1.12} d={0.46} color={cream} />
      <B x={0.2} y={1.18} z={2.10} w={2.92} h={0.16} d={0.50} color={dkCream} />
      {([-0.82, 0.20, 1.22] as number[]).map((ax,i) => (
        <B key={`ea${i}`} x={ax} y={0.54} z={2.34} w={0.46} h={0.72} d={0.06} color="#8A9870" shadow={false} />
      ))}
      {/* Steps */}
      <B x={0.2} y={0.08} z={2.44} w={2.60} h={0.16} d={0.52} color="#E8E0CC" />
      <B x={0.2} y={0.18} z={2.28} w={2.40} h={0.12} d={0.38} color="#E4DCC8" />

      {/* ── Right chapel wing ── */}
      <B x={2.18} y={0.66} z={-0.60} w={1.44} h={1.32} d={2.80} color={dkCream} />
      <GableRoof x={2.18} y={1.34} z={-0.60} w={1.64} h={0.72} d={3.10} color={greenR} />

      {/* ── Our Lady of Peñafrancia — scales in when selected ── */}
      <PenafranciaPedestal selected={selected} />

      {/* ── Many palm trees (like real basilica grounds) ── */}
      <Palm x={-2.2} z={3.6} s={1.10} /> <Palm x={-1.1} z={3.8} s={1.05} />
      <Palm x={ 0.2} z={3.8} s={1.00} /> <Palm x={ 1.5} z={3.6} s={1.08} />
      <Palm x={ 2.6} z={3.2} s={1.02} /> <Palm x={-2.8} z={2.2} s={0.95} />
      <Palm x={-3.4} z={ 0.8} s={1.00} /> <Palm x={-3.2} z={-0.8} s={0.92} />
      <Palm x={-2.8} z={-2.4} s={0.98} /> <Palm x={ 3.2} z={ 1.5} s={0.95} />
      <Palm x={ 3.4} z={-0.5} s={1.00} /> <Palm x={ 3.0} z={-2.2} s={0.92} />
    </group>
  )
}

// ── Kinalas bowl icon ─────────────────────────────────────────────────────────
function KinalasBowl() {
  const bowlC  = '#F5F3EE', broth  = '#7A5218', noodle = '#CFAB2A'
  const meat   = '#5C3A22', chiliR = '#D62020', green  = '#4A8820'
  const eggW   = '#F0EAD4', chich  = '#C8922A'
  return (
    <group>
      {/* Ceramic bowl */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[1.05, 0.60, 0.64, 16]} />
        <meshLambertMaterial color={bowlC} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.58, 0.54, 0.04, 14]} />
        <meshLambertMaterial color={bowlC} />
      </mesh>
      {/* Broth surface */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.62, 0]}>
        <circleGeometry args={[0.91, 16]} />
        <meshLambertMaterial color={broth} />
      </mesh>
      {/* Egg noodle strands at 30° intervals */}
      {([0, 30, 60, 90, 120, 150] as number[]).map((deg, i) => (
        <mesh key={`nd${i}`} position={[0, 0.66, 0]} rotation={[0, (deg * Math.PI) / 180, 0]}>
          <boxGeometry args={[1.55, 0.038, 0.058]} />
          <meshLambertMaterial color={noodle} />
        </mesh>
      ))}
      {/* Shredded meat pile */}
      <mesh position={[-0.12, 0.70, 0.05]} castShadow>
        <sphereGeometry args={[0.30, 6, 4]} />
        <meshLambertMaterial color={meat} />
      </mesh>
      <mesh position={[0.10, 0.68, -0.06]} castShadow>
        <sphereGeometry args={[0.20, 6, 4]} />
        <meshLambertMaterial color="#503A28" />
      </mesh>
      {/* Hard boiled egg */}
      <mesh position={[0.50, 0.72, -0.24]} castShadow>
        <sphereGeometry args={[0.22, 8, 6]} />
        <meshLambertMaterial color={eggW} />
      </mesh>
      {/* Chicharon puffs */}
      <mesh position={[-0.34, 0.72, 0.40]} castShadow>
        <sphereGeometry args={[0.18, 5, 4]} />
        <meshLambertMaterial color={chich} />
      </mesh>
      <mesh position={[-0.14, 0.70, 0.55]} castShadow>
        <sphereGeometry args={[0.14, 5, 4]} />
        <meshLambertMaterial color={chich} />
      </mesh>
      {/* Red chili peppers */}
      <mesh position={[0.06, 0.76, -0.04]} rotation={[0.30, 0.45, Math.PI / 2 - 0.25]} castShadow>
        <cylinderGeometry args={[0.028, 0.014, 0.40, 5]} />
        <meshLambertMaterial color={chiliR} />
      </mesh>
      <mesh position={[-0.06, 0.76, 0.10]} rotation={[0.20, -0.35, Math.PI / 2 - 0.15]} castShadow>
        <cylinderGeometry args={[0.024, 0.012, 0.36, 5]} />
        <meshLambertMaterial color={chiliR} />
      </mesh>
      {/* Green onion strips */}
      {([[0.14, 0.80, -0.30], [-0.30, 0.79, 0.20], [0.28, 0.79, 0.34]] as [number,number,number][]).map(([x,y,z],i) => (
        <mesh key={`go${i}`} position={[x, y, z]} rotation={[0, i * 0.85, Math.PI / 2 * 0.85]}>
          <cylinderGeometry args={[0.017, 0.010, 0.32, 4]} />
          <meshLambertMaterial color={green} />
        </mesh>
      ))}
    </group>
  )
}

function KinalasBowlProp({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.position.set(0, 3.5, 0.5)
    ref.current.scale.setScalar(0)
  }, [])
  useFrame((state, dt) => {
    if (!ref.current) return
    const target = selected ? 1.5 : 0.0
    const curr = ref.current.scale.x
    ref.current.scale.setScalar(curr + (target - curr) * dt * 7)
    const t = Math.min(curr / 1.5, 1)
    ref.current.position.y = 3.5 + Math.sin(state.clock.elapsedTime * 1.2) * 0.12 * t
  })
  return (
    <group ref={ref}>
      <KinalasBowl />
    </group>
  )
}

// ── Zone 2: Kinalas Food Trail — traditional Filipino house (SW) ───────────────
function KinalasZone({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (!ref.current) return
    ref.current.position.y += ((selected ? 0.2 : 0) - ref.current.position.y) * dt * 5
  })
  const roofC='#E8D8A0', roofDk='#C8B870', wall='#F0E8D4', post='#5C3D28'
  const lattice='#8B6A3A', floor='#A87A50', stone='#A09080', grass='#9E8A60'
  return (
    <group ref={ref} position={[-7,0,6]}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.005,0]}>
        <planeGeometry args={[8,8]} /><meshLambertMaterial color={grass} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.005,1.8]}>
        <planeGeometry args={[4.0,2.6]} /><meshLambertMaterial color="#B8A480" />
      </mesh>
      {([[0,2.9],[-0.5,2.4],[0.5,2.4],[0,1.9]] as [number,number][]).map(([sx,sz],i) => (
        <mesh key={`st${i}`} position={[sx,0.025,sz]} rotation={[-Math.PI/2,0,0]}>
          <cylinderGeometry args={[0.18,0.20,0.05,6]} /><meshLambertMaterial color={stone} />
        </mesh>
      ))}
      <B x={0} y={0.14} z={0} w={4.4} h={0.28} d={2.8} color={floor} />
      {([ [-1.6,-1.1],[-1.6,0],[-1.6,1.1],[1.6,-1.1],[1.6,0],[1.6,1.1] ] as [number,number][]).map(([px,pz],i) => (
        <mesh key={`pl${i}`} position={[px,0.95,pz]} castShadow>
          <cylinderGeometry args={[0.075,0.085,1.62,6]} /><meshLambertMaterial color={post} />
        </mesh>
      ))}
      {([[-0.6,1.1],[0.6,1.1]] as [number,number][]).map(([px,pz],i) => (
        <mesh key={`plf${i}`} position={[px,0.95,pz]} castShadow>
          <cylinderGeometry args={[0.065,0.075,1.62,6]} /><meshLambertMaterial color={post} />
        </mesh>
      ))}
      <B x={0}     y={0.80} z={-1.10} w={3.40} h={1.10} d={0.10} color={wall} />
      <B x={-1.55} y={0.80} z={ 0.05} w={0.10} h={1.10} d={2.10} color={wall} />
      <B x={ 1.55} y={0.80} z={ 0.05} w={0.10} h={1.10} d={2.10} color={wall} />
      <B x={0}     y={0.85} z={ 1.10} w={3.60} h={1.05} d={0.06} color={wall} />
      {([-1.4,-1.0,-0.6,-0.2,0.2,0.6,1.0,1.4] as number[]).map((lx,i) => (
        <B key={`lb${i}`} x={lx} y={0.88} z={1.14} w={0.05} h={0.95} d={0.04} color={lattice} shadow={false} />
      ))}
      {([0.56,0.84,1.10,1.32] as number[]).map((ly,i) => (
        <B key={`lh${i}`} x={0} y={ly} z={1.14} w={3.55} h={0.04} d={0.04} color={lattice} shadow={false} />
      ))}
      <B x={0} y={0.34} z={1.52} w={1.05} h={0.50} d={0.80} color={wall} />
      <HipRoof x={0} y={0.62} z={1.52} r={0.70} h={0.30} color={roofDk} />
      {([-0.28,0.28] as number[]).map((vx,i) => (
        <B key={`vw${i}`} x={vx} y={0.40} z={1.94} w={0.20} h={0.22} d={0.04} color={lattice} shadow={false} />
      ))}
      <Cone x={0} y={1.75} z={0} r={2.85} h={0.80} sides={4} rotY={Math.PI/4} color={roofC} />
      <B x={0} y={2.16} z={0} w={4.60} h={0.10} d={0.18} color={roofC} shadow={false} />
      <B x={-2.7} y={0.38} z={-0.6} w={1.20} h={0.76} d={1.10} color="#C8B898" />
      <HipRoof x={-2.7} y={0.82} z={-0.6} r={0.82} h={0.38} color={roofC} />
      <B x={1.6} y={0.45} z={2.2} w={1.30} h={0.58} d={0.55} color={post} />
      <B x={1.6} y={0.76} z={2.2} w={1.40} h={0.10} d={0.62} color="#8B6040" shadow={false} />
      {([-0.3,0.0,0.3] as number[]).map((bx,i) => (
        <mesh key={`bw${i}`} position={[1.6+bx,0.84,2.2]} castShadow>
          <cylinderGeometry args={[0.08,0.06,0.07,7]} /><meshLambertMaterial color={i===1?'#E8DCC8':'#F5F0E5'} />
        </mesh>
      ))}
      <Palm x={-2.8} z={1.8} s={0.85} /><Palm x={2.8} z={1.5} s={0.80} />
      <Tree x={-2.5} z={-2.0} s={0.90} /><Tree x={2.2} z={-2.2} s={0.85} />
      {([[-1.80,1.45],[1.80,1.45]] as [number,number][]).map(([px,pz],i) => (
        <group key={`pot${i}`}>
          <mesh position={[px,0.22,pz]} castShadow>
            <cylinderGeometry args={[0.11,0.08,0.22,7]} /><meshLambertMaterial color="#8B5E3C" />
          </mesh>
          <Cone x={px} y={0.46} z={pz} r={0.14} h={0.28} sides={6} color="#3D7254" />
        </group>
      ))}
      <KinalasBowlProp selected={selected} />
    </group>
  )
}

// ── Robredo Heritage popup — "Matino Mahusay Matapat" installation ────────────
function RobredoHeritage() {
  const yellow   = '#E8B820'
  const bronze   = '#7A5A2E'
  const bronzeDk = '#5A4018'
  const stone    = '#A09088'
  const labels: [number, string][] = [[-0.60, 'M\nA\nT\nI\nN\nO'], [0, 'M\nA\nH\nU\nS\nA\nY'], [0.60, 'M\nA\nT\nA\nP\nA\nT']]
  return (
    <group>
      {/* Three yellow pillars */}
      {labels.map(([x, label], i) => (
        <group key={i}>
          <B x={x} y={1.10} z={0} w={0.36} h={2.20} d={0.12} color={yellow} />
          <Text position={[x, 1.10, 0.07]} fontSize={0.095} color="#3A2800"
            anchorX="center" anchorY="middle" lineHeight={1.15} outlineWidth={0.008} outlineColor={yellow}>
            {label}
          </Text>
        </group>
      ))}
      {/* Stone plinth */}
      <B x={0} y={0.06} z={0.50} w={1.10} h={0.12} d={0.90} color={stone} />
      {/* Seated boy — torso */}
      <B x={0} y={0.44} z={0.44} w={0.28} h={0.34} d={0.18} color={bronze} />
      {/* Head slightly turned */}
      <mesh position={[0.04, 0.70, 0.42]} castShadow>
        <sphereGeometry args={[0.12, 7, 6]} />
        <meshLambertMaterial color={bronze} />
      </mesh>
      {/* Left leg extended forward */}
      <B x={-0.10} y={0.16} z={0.65} w={0.10} h={0.20} d={0.50} color={bronze} />
      {/* Right leg bent */}
      <B x={ 0.10} y={0.28} z={0.52} w={0.10} h={0.34} d={0.22} color={bronze} />
      {/* Right foot */}
      <B x={ 0.10} y={0.10} z={0.74} w={0.10} h={0.12} d={0.20} color={bronzeDk} />
      {/* Left arm propping behind */}
      <B x={-0.20} y={0.34} z={0.42} w={0.10} h={0.10} d={0.26} color={bronzeDk} />
      {/* Right arm resting on knee */}
      <B x={ 0.16} y={0.50} z={0.52} w={0.09} h={0.26} d={0.11} color={bronze} />
    </group>
  )
}

function RobredoHeritageProp({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.position.set(0, 3.0, 0)
    ref.current.scale.setScalar(0)
  }, [])
  useFrame((state, dt) => {
    if (!ref.current) return
    const target = selected ? 1.3 : 0.0
    const curr = ref.current.scale.x
    ref.current.scale.setScalar(curr + (target - curr) * dt * 7)
    const t = Math.min(curr / 1.3, 1)
    ref.current.position.y = 3.0 + Math.sin(state.clock.elapsedTime * 1.2) * 0.10 * t
  })
  return (
    <group ref={ref}>
      <RobredoHeritage />
    </group>
  )
}

// ── Zone 3: Museo ni Jesse Robredo (NW) ───────────────────────────────────────
function RobredoZone({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (!ref.current) return
    ref.current.position.y += ((selected ? 0.2 : 0) - ref.current.position.y) * dt * 5
  })
  const woodSlat='#8B5433', roofEdge='#4A2E1A', yellow='#E8B830', pave='#C4BCA8'
  const arcSegs=11, arcR=2.1, arcStart=Math.PI/2, arcTotal=Math.PI*1.5
  const segBoxW=(arcR*arcTotal/arcSegs)*1.12
  return (
    <group ref={ref} position={[-7,0,-6]}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.005,0]}>
        <planeGeometry args={[8,8]} /><meshLambertMaterial color="#7AB460" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[-0.3,0.01,-0.3]}>
        <circleGeometry args={[1.9,16]} /><meshLambertMaterial color={pave} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[-0.3,0.015,-0.3]}>
        <ringGeometry args={[1.0,1.15,16]} /><meshLambertMaterial color="#B8B0A0" />
      </mesh>
      {Array.from({ length: arcSegs + 1 }, (_,i) => {
        const t = i/arcSegs, angle = arcStart + t*arcTotal
        const wx = Math.cos(angle)*arcR, wz = Math.sin(angle)*arcR
        return (
          <mesh key={i} position={[wx,0.55,wz]} rotation={[0,-angle,0]} castShadow>
            <boxGeometry args={[0.34,1.1,segBoxW]} /><meshLambertMaterial color={woodSlat} />
          </mesh>
        )
      })}
      {Array.from({ length: arcSegs + 1 }, (_,i) => {
        const t = i/arcSegs, angle = arcStart + t*arcTotal
        const wx = Math.cos(angle)*arcR, wz = Math.sin(angle)*arcR
        return (
          <mesh key={i} position={[wx,1.15,wz]} rotation={[0,-angle,0]}>
            <boxGeometry args={[0.42,0.14,segBoxW+0.08]} /><meshLambertMaterial color={roofEdge} />
          </mesh>
        )
      })}
      <B x={0.62} y={0.7} z={1.42} w={0.20} h={1.40} d={0.20} color={yellow} />
      <B x={1.42} y={0.7} z={0.62} w={0.20} h={1.40} d={0.20} color={yellow} />
      <B x={0.62} y={1.46} z={1.42} w={0.28} h={0.10} d={0.28} color={yellow} shadow={false} />
      <B x={1.42} y={1.46} z={0.62} w={0.28} h={0.10} d={0.28} color={yellow} shadow={false} />
      <B x={0.9} y={0.08} z={0.9} w={0.35} h={0.16} d={0.35} color="#A0988A" />
      <B x={0.9} y={0.40} z={0.9} w={0.22} h={0.38} d={0.20} color="#5A5650" />
      <mesh position={[0.9,0.65,0.9]} castShadow>
        <sphereGeometry args={[0.10,7,6]} /><meshLambertMaterial color="#8A7A68" />
      </mesh>
      <B x={0.95} y={0.08} z={1.72} w={1.05} h={0.16} d={0.45} color={pave} />
      <B x={0.95} y={0.20} z={1.52} w={0.90} h={0.12} d={0.40} color="#B8B0A0" />
      <B x={0.95} y={0.30} z={1.36} w={0.78} h={0.10} d={0.35} color="#ACA498" />
      <B x={-0.3} y={0.80} z={-2.08} w={1.8} h={0.28} d={0.04} color={yellow} shadow={false} />
      <group position={[-0.5,0,-0.4]} scale={1.5}>
        <B x={0} y={0.28} z={0} w={0.12} h={0.56} d={0.12} color="#5C3D28" />
        <Cone x={0} y={0.78} z={0} r={0.38} h={0.72} sides={7} color="#3D7254" />
        <Cone x={0} y={1.15} z={0} r={0.28} h={0.58} sides={7} color="#2D5A44" />
        <Cone x={0} y={1.45} z={0} r={0.18} h={0.44} sides={7} color="#254A38" />
      </group>
      <Tree x={-2.5} z={ 0.5} s={1.15} /><Tree x={-1.8} z={-2.2} s={1.00} />
      <Tree x={ 0.5} z={-2.5} s={1.05} /><Tree x={ 2.3} z={-1.5} s={0.85} />
      <RobredoHeritageProp selected={selected} />
    </group>
  )
}

// ── Animated waterfall strips ─────────────────────────────────────────────────
function AnimatedWaterfall({
  topY=4.8, bottomY=0.2, x=0, z=0.50, width=0.82, strips=6, speed=0.42
}: {
  topY?: number; bottomY?: number; x?: number; z?: number
  width?: number; strips?: number; speed?: number
}) {
  const ref = useRef<THREE.Group>(null)
  const height = topY - bottomY
  const stripH = (height / strips) * 0.80

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * speed
    ref.current.children.forEach((child, i) => {
      const frac = ((t + i / strips) % 1)
      child.position.y = bottomY + (1 - frac) * height
    })
  })

  return (
    <group ref={ref}>
      {Array.from({ length: strips }, (_, i) => (
        <mesh key={i} position={[x, topY, z]}>
          <boxGeometry args={[width, stripH, 0.13]} />
          <meshLambertMaterial
            color={i % 2 === 0 ? '#5A9EC8' : '#7ABEDE'}
            transparent opacity={0.72} depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// ── Malabsay Falls ─────────────────────────────────────────────────────────────
function MalabsayFalls({ x=0, y=0, z=0 }: { x?:number; y?:number; z?:number }) {
  const rock = '#7A7060', moss = '#4A6A40'
  const water = '#4A88B8', spray = '#88BBDD'
  const mistMat = useRef<THREE.MeshLambertMaterial>(null)
  const poolMat = useRef<THREE.MeshLambertMaterial>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mistMat.current) mistMat.current.opacity = 0.16 + Math.sin(t * 2.4) * 0.08
    if (poolMat.current) poolMat.current.opacity = 0.82 + Math.sin(t * 1.8 + 1.0) * 0.06
  })

  return (
    <group position={[x, y, z]}>
      {/* Cliff face */}
      <B x={0}    y={2.2} z={0}    w={2.0}  h={4.4}  d={0.8}  color={rock} />
      <B x={0}    y={4.6} z={0.3}  w={2.4}  h={0.5}  d={1.0}  color="#8A8070" />
      {/* Moss on cliff */}
      <B x={-0.5} y={2.0} z={0.45} w={0.6}  h={2.8}  d={0.12} color={moss} shadow={false} />
      <B x={ 0.6} y={1.6} z={0.45} w={0.4}  h={2.0}  d={0.12} color={moss} shadow={false} />
      {/* Dark backdrop so gaps between strips are filled */}
      <B x={0}    y={2.4} z={0.44} w={0.85} h={4.8}  d={0.06} color="#2A5A88" shadow={false} />
      {/* Animated main cascade */}
      <AnimatedWaterfall topY={4.8} bottomY={0.22} x={0} z={0.50} width={0.82} strips={6} speed={0.44} />
      {/* Animated second tier */}
      <AnimatedWaterfall topY={1.28} bottomY={0.22} x={0.1} z={0.58} width={0.66} strips={4} speed={0.52} />
      {/* Spray/mist at base — opacity pulses */}
      <mesh position={[0, 0.08, 1.0]}>
        <sphereGeometry args={[0.55, 7, 4]} />
        <meshLambertMaterial ref={mistMat} color={spray} transparent opacity={0.22} />
      </mesh>
      {/* Pool — shimmer */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.06, 1.2]}>
        <planeGeometry args={[2.0, 1.4]} />
        <meshLambertMaterial ref={poolMat} color={water} transparent opacity={0.88} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, 0.07, 1.0]}>
        <planeGeometry args={[0.9, 0.6]} />
        <meshLambertMaterial color={spray} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      {/* Boulders */}
      <mesh position={[-0.8, 0.15, 1.4]} castShadow>
        <sphereGeometry args={[0.28, 5, 4]} /><meshLambertMaterial color={rock} />
      </mesh>
      <mesh position={[0.9, 0.12, 1.5]} castShadow>
        <sphereGeometry args={[0.22, 5, 4]} /><meshLambertMaterial color="#8A8070" />
      </mesh>
    </group>
  )
}

// ── Zone 4: Mount Isarog — backdrop mountain, city at its foot ────────────────
function IsarogZone({ selected }: { selected: boolean }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_,dt) => {
    if (!ref.current) return
    ref.current.position.y += ((selected ? 0.2 : 0) - ref.current.position.y) * dt * 5
  })

  // All-green palette
  const gBase  = '#3E6B24', gMid = '#4A7A2C'
  const capW = '#D0D8C8'
  const water  = '#4A88B8', waterH = '#6AA8D0'

  return (
    <group ref={ref} position={[0,0,-26]}>
      {/* River stream at mountain foot */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[-2.0,0.015,13.0]}>
        <planeGeometry args={[4.3,2.2]} /><meshLambertMaterial color={water} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[-1.4,0.018,12.8]}>
        <planeGeometry args={[1.8,0.7]} /><meshLambertMaterial color={waterH} transparent opacity={0.6} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[1.2,0.015,15.0]}>
        <planeGeometry args={[1.1,3.2]} /><meshLambertMaterial color={water} />
      </mesh>
      {/* Dock */}
      <B x={1.2} y={0.09} z={13.5} w={1.0} h={0.10} d={0.36} color="#6B4C30" shadow={false} />
      <B x={0.8} y={0.22} z={13.5} w={0.07} h={0.25} d={0.10} color="#5A3A20" shadow={false} />
      <B x={1.6} y={0.22} z={13.5} w={0.07} h={0.25} d={0.10} color="#5A3A20" shadow={false} />

      {/* Hiking trail along south face */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[6.0,0.01,9.0]}>
        <planeGeometry args={[0.40,14]} /><meshLambertMaterial color="#8AAA60" />
      </mesh>

      {/* ── MOUNTAIN — r=17, matches board width of 34 ── */}
      {/* Base disc */}
      <mesh position={[0, 0.60, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[15.5, 17.0, 1.20, 7]} />
        <meshLambertMaterial color={gBase} />
      </mesh>
      {/* Main body — r=17, h=15 → wide low silhouette */}
      <Cone x={ 0.0} y={ 8.2} z={ 0.0} r={17.0} h={15.0} sides={7} color={gBase}   />
      {/* Left ridge */}
      <Cone x={-4.0} y={ 7.7} z={-2.5} r={13.0} h={14.0} sides={7} color={gBase}   />
      {/* Right shoulder */}
      <Cone x={ 4.0} y={ 7.2} z={ 2.5} r={12.0} h={13.0} sides={6} color={gMid}    />
      {/* Back ridge */}
      <Cone x={-1.5} y={ 6.2} z={-5.0} r={10.0} h={10.0} sides={6} color={gBase}   />
      {/* Snow cap — tip of main cone at y≈15.7 */}
      <Cone x={ 0.3} y={16.7} z={ 0.0} r={2.2} h={2.5} sides={5} rotY={Math.PI/8} color={capW}    />
      <Cone x={ 0.3} y={18.5} z={ 0.0} r={0.8} h={1.5} sides={4} rotY={Math.PI/4} color="#EEF3EE" />
      <Cone x={ 0.3} y={19.5} z={ 0.0} r={0.13} h={0.6} sides={4}                  color="#F8FAF8"  />

      {/* Tent at base camp */}
      <Cone x={12.0} y={0.32} z={10.0} r={0.54} h={0.83} sides={4} rotY={Math.PI/4} color="#E85820" />
      <B   x={12.0} y={0.11} z={10.0} w={0.99} h={0.22} d={0.99} color="#C84818" />

      {/* Malabsay Falls — on south slope, elevated onto mountain face */}
      <MalabsayFalls x={ 3.0} y={3.8} z={13.0} />
      {/* Secondary falls — west slope */}
      <MalabsayFalls x={-5.0} y={4.2} z={11.0} />
      {/* Small falls — east slope */}
      <MalabsayFalls x={ 7.0} y={3.0} z={10.0} />

      {/* Pine forest ring around base — outer ring at radius ≈18 */}
      <PineTree x={-17.0} z={ 5.0} s={1.20} /> <PineTree x={-15.6} z={ 9.0} s={1.10} />
      <PineTree x={-12.0} z={13.5} s={1.15} /> <PineTree x={ -6.0} z={17.0} s={1.05} />
      <PineTree x={  0.0} z={18.0} s={1.10} /> <PineTree x={  6.0} z={17.0} s={1.05} />
      <PineTree x={ 12.0} z={13.5} s={1.12} /> <PineTree x={ 15.6} z={ 9.0} s={1.08} />
      <PineTree x={ 17.0} z={ 5.0} s={1.00} /> <PineTree x={-17.0} z={-5.0} s={0.95} />
      <PineTree x={ 17.0} z={-5.0} s={1.00} /> <PineTree x={-15.6} z={-9.0} s={0.95} />
      {/* Inner ring at radius ≈14 */}
      <PineTree x={-13.0} z={ 5.0} s={0.90} /> <PineTree x={ -9.0} z={11.0} s={0.85} />
      <PineTree x={  0.0} z={13.5} s={0.88} /> <PineTree x={  9.0} z={11.0} s={0.85} />
      <PineTree x={ 13.0} z={ 5.0} s={0.82} /> <PineTree x={-13.0} z={-5.0} s={0.84} />
      <PineTree x={  0.0} z={-13.5} s={0.82} /> <PineTree x={ 13.0} z={-5.0} s={0.84} />
      <PineTree x={ 10.0} z={-9.0} s={0.86} /> <PineTree x={-10.0} z={-9.0} s={0.82} />
    </group>
  )
}

// ── Zone click target + label ──────────────────────────────────────────────────
function ZoneHitArea({ destId, position, name, color, selected }: {
  destId:DestinationId; position:[number,number,number]
  name:string; color:string; selected:boolean
}) {
  const { selectDestination } = useAppStore()
  const labelY = destId==='isarog' ? 20.5
    : destId==='basilica' ? 7.5
    : destId==='quincemart' ? 4.2
    : destId==='robredo' ? 2.2
    : 3.2
  const hitSize = destId === 'isarog' ? 18 : 9

  return (
    <group position={position}>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.03,0]}
        onClick={e => { e.stopPropagation(); selectDestination(selected ? null : destId) }}
        onPointerOver={() => { document.body.style.cursor='pointer' }}
        onPointerOut={() =>  { document.body.style.cursor='grab' }}>
        <planeGeometry args={[hitSize, hitSize]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {selected && (
        <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.04,0]}>
          <ringGeometry args={[3.4,3.7,28]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}
      <Text
        position={[0, selected ? labelY+0.5 : labelY, 0]}
        fontSize={0.56}
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

// ── Street trees ───────────────────────────────────────────────────────────────
function StreetTrees() {
  const pts: [number,number][] = [
    [1.9,1.0],[-1.9,1.0],[1.9,-1.0],[-1.9,-1.0],
    [1.0,1.9],[-1.0,1.9],[1.0,-1.9],[-1.0,-1.9],
    [3.4,2.6],[-3.4,2.6],[3.4,-2.6],[-3.4,-2.6],
    [2.6,3.4],[-2.6,3.4],[2.6,-3.4],[-2.6,-3.4],
  ]
  return <>{pts.map(([x,z],i)=><Tree key={i} x={x} z={z} s={0.62+(i%4)*0.07} />)}</>
}

// ── Surrounding city blocks ────────────────────────────────────────────────────
function SurroundingCity() {
  type HC = [number,number,number,string,string,number,number]
  const houses: HC[] = [
    [-11,10.5,Math.PI,'#E8DCCA','#7A3A2A',1.2,1.0],[-8.5,10,Math.PI,'#EDE0C8','#8B4A3A',1.0,0.9],
    [-6,10.5,Math.PI,'#DDD0B8','#703228',1.15,0.95],[-3.5,10,Math.PI,'#E8D8C0','#7A4030',1.3,1.05],
    [-1.5,10.5,Math.PI,'#E4D8C8','#8B3820',1.0,0.9],[1.5,10,Math.PI,'#EAE0CC','#7A3A28',1.1,1.0],
    [3.5,10.5,Math.PI,'#E0D4C0','#703222',1.2,0.95],[6,10,Math.PI,'#E8DCC8','#8B4A3A',1.0,0.9],
    [8.5,10.5,Math.PI,'#EDE4D0','#7A3828',1.1,1.0],[11,10,Math.PI,'#E4D8C4','#6A3020',1.2,1.05],
    [-11,-10.5,0,'#DCCEC0','#7A3828',1.2,1.0],[-8.5,-10,0,'#E8DCC8','#8B4A3A',1.0,0.9],
    [-6,-10.5,0,'#E2D8C4','#703228',1.15,0.95],[-3.5,-10,0,'#E8D4BC','#7A4030',1.3,1.0],
    [-1.5,-10.5,0,'#E4D8C8','#8B3820',1.0,0.9],[1.5,-10,0,'#EADEC8','#7A3A28',1.1,1.0],
    [3.5,-10.5,0,'#E0D4BC','#703222',1.2,0.95],[6,-10,0,'#E8DCC8','#8B4A3A',1.0,0.9],
    [8.5,-10.5,0,'#EDE4D0','#7A3828',1.1,1.0],[11,-10,0,'#E4D8C4','#6A3020',1.2,1.05],
    [11.5,-7,-Math.PI/2,'#E8DCCC','#7A3828',1.1,1.0],[11,-4.5,-Math.PI/2,'#E4D8C8','#8B4A3A',1.2,0.95],
    [11.5,-2,-Math.PI/2,'#EDE0CC','#7A4030',1.0,0.9],[11,2,-Math.PI/2,'#E8D8C4','#8B3820',1.1,1.0],
    [11.5,4.5,-Math.PI/2,'#E4DCCC','#7A3A28',1.2,0.95],[11,7,-Math.PI/2,'#EADEC8','#703222',1.0,0.9],
    [-11.5,-7,Math.PI/2,'#E4D8C0','#7A3828',1.1,1.0],[-11,-4.5,Math.PI/2,'#E8DCC8','#8B4A3A',1.2,0.95],
    [-11.5,-2,Math.PI/2,'#DCCEC0','#7A4030',1.0,0.9],[-11,2,Math.PI/2,'#E8D8C4','#8B3820',1.1,1.0],
    [-11.5,4.5,Math.PI/2,'#E4DCCC','#7A3A28',1.2,0.95],[-11,7,Math.PI/2,'#EADEC8','#703222',1.0,0.9],
  ]
  type SC = [number,number,number,string,string]
  const shops: SC[] = [
    [-9.5,11.5,Math.PI,'#D8CEBC','#6A3A2A'],[9.5,11.5,Math.PI,'#D4CAB8','#5A3020'],
    [-9.5,-11.5,0,'#D8CEBC','#6A3A2A'],[9.5,-11.5,0,'#D4CAB8','#5A3020'],
    [12.5,0,-Math.PI/2,'#DCCEC0','#6A3428'],[-12.5,0,Math.PI/2,'#D8CEBC','#6A3428'],
    [0,12.2,Math.PI,'#D4CCC0','#5A3428'],[0,-12.2,0,'#D8CEBC','#6A3028'],
  ]
  type TB = [number,number,number,string,string,number]
  const tallBuildings: TB[] = [
    [-8,8,0,'#D4CCB8','#9A7850',3],[8,8,0,'#CEC8B8','#8A7040',3],
    [-8,-8,0,'#D0CAB8','#9A7040',3],[8,-8,0,'#CCC8B4','#8A6840',3],
    [-5.5,11,Math.PI,'#D8D0C0','#887048',2],[5.5,11,Math.PI,'#D4CCC0','#887040',2],
    [-5.5,-11,0,'#D8D0C0','#887048',2],[5.5,-11,0,'#D4CCC0','#887040',2],
    [12,5.5,-Math.PI/2,'#D0C8B8','#907848',2],[12,-5.5,-Math.PI/2,'#D4CCB8','#907040',2],
    [-12,5.5,Math.PI/2,'#D0C8B8','#907848',2],[-12,-5.5,Math.PI/2,'#D4CCB8','#907040',2],
  ]
  const outerTrees: [number,number,number][] = [
    [-12.5,11,0.82],[12.5,11,0.78],[-12.5,-11,0.84],[12.5,-11,0.76],
    [-7.5,12,0.74],[7.5,12,0.72],[-7.5,-12,0.75],[7.5,-12,0.73],
    [13,5,0.70],[13,-5,0.72],[-13,5,0.70],[-13,-5,0.73],
    [0,12.8,0.68],[0,-12.8,0.70],[-12.8,0,0.69],[12.8,0,0.68],
    [-3.5,11.5,0.66],[3.5,11.5,0.67],[-3.5,-11.5,0.66],[3.5,-11.5,0.67],
  ]
  return (
    <>
      {houses.map(([x,z,rot,wc,rc,sw,sd],i) => <SmHouse key={`h${i}`} x={x} z={z} rot={rot} wc={wc} rc={rc} sw={sw} sd={sd} />)}
      {shops.map(([x,z,rot,wc,rc],i) => <ShopBuilding key={`s${i}`} x={x} z={z} rot={rot} wc={wc} rc={rc} />)}
      {tallBuildings.map(([x,z,rot,wc,ac,floors],i) => <TallBuilding key={`t${i}`} x={x} z={z} rot={rot} wc={wc} ac={ac} floors={floors} />)}
      {outerTrees.map(([x,z,s],i) => <Tree key={`ot${i}`} x={x} z={z} s={s} />)}
    </>
  )
}

// ── Drive-along path follower ──────────────────────────────────────────────────
function DriveAlong({ path, speed=1, offset=0, children }: {
  path: [number,number][];
  speed?: number;
  offset?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null)
  const t   = useRef(offset % 1)
  useFrame((_, dt) => {
    t.current = (t.current + dt * speed * 0.055) % 1
    const n = path.length, pos = t.current * (n - 1)
    const i0 = Math.min(Math.floor(pos), n - 2)
    const f  = pos - i0
    const [x1, z1] = path[i0], [x2, z2] = path[i0 + 1]
    if (!ref.current) return
    ref.current.position.set(x1 + (x2 - x1) * f, 0, z1 + (z2 - z1) * f)
    const dx = x2 - x1, dz = z2 - z1
    if (Math.abs(dx) + Math.abs(dz) > 0.001)
      ref.current.rotation.y = Math.atan2(-dz, dx)
  })
  return <group ref={ref}>{children}</group>
}

// ── Vehicles ───────────────────────────────────────────────────────────────────
function Vehicles() {
  // Lanes: main N-S road x=+0.40 southbound, x=-0.38 northbound
  //        main E-W road z=-0.38 westbound,  z=+0.40 eastbound
  //        secondary N-S x=±5.2; secondary E-W z=±4.8
  // Main roads reach the gate openings in the fence (z/x ≈ ±13)
  const NS_S  : [number,number][] = [[ 0.40, 12], [ 0.40,-12]]
  const NS_N  : [number,number][] = [[-0.38,-12], [-0.38, 12]]
  const EW_E  : [number,number][] = [[-12,  0.40], [12,  0.40]]
  const EW_W  : [number,number][] = [[ 12, -0.38], [-12,-0.38]]
  // Secondary roads stop before perimeter buildings (z=±10, x=±11)
  const SEC_S1: [number,number][] = [[ 5.35,  9], [ 5.35, -9]]
  const SEC_N1: [number,number][] = [[-5.05, -9], [-5.05,  9]]
  const SEC_E1: [number,number][] = [[-10,  4.95], [10,  4.95]]
  const SEC_W1: [number,number][] = [[ 10, -4.65], [-10, -4.65]]
  const SEC_S2: [number,number][] = [[ 5.35,  9], [ 5.35, -9]]
  const SEC_N2: [number,number][] = [[-5.05, -9], [-5.05,  9]]

  return (
    <>
      {/* Jeepneys — main roads */}
      <DriveAlong path={NS_S}  speed={0.78} offset={0.05}>
        <Jeepney x={0} z={0} rot={0} body="#CC2222" stripe="#F0C040" />
      </DriveAlong>
      <DriveAlong path={NS_N}  speed={0.88} offset={0.55}>
        <Jeepney x={0} z={0} rot={0} body="#1A4499" stripe="#F0C040" />
      </DriveAlong>
      <DriveAlong path={EW_E}  speed={0.82} offset={0.25}>
        <Jeepney x={0} z={0} rot={0} body="#228844" stripe="#FFEE44" />
      </DriveAlong>
      <DriveAlong path={EW_W}  speed={0.74} offset={0.72}>
        <Jeepney x={0} z={0} rot={0} body="#AA2244" stripe="#F0C040" />
      </DriveAlong>

      {/* Buses — main roads, slower */}
      <DriveAlong path={NS_S}  speed={0.50} offset={0.38}>
        <Bus x={0} z={0} rot={0} color="#1E3A88" />
      </DriveAlong>
      <DriveAlong path={NS_N}  speed={0.48} offset={0.82}>
        <Bus x={0} z={0} rot={0} color="#2B5BAA" />
      </DriveAlong>

      {/* Cars — main roads */}
      <DriveAlong path={NS_S}  speed={1.05} offset={0.18}>
        <Car x={0} z={0} rot={0} color="#884422" />
      </DriveAlong>
      <DriveAlong path={NS_N}  speed={1.10} offset={0.65}>
        <Car x={0} z={0} rot={0} color="#3A6A99" />
      </DriveAlong>
      <DriveAlong path={EW_E}  speed={1.00} offset={0.42}>
        <Car x={0} z={0} rot={0} color="#776655" />
      </DriveAlong>
      <DriveAlong path={EW_W}  speed={0.95} offset={0.88}>
        <Car x={0} z={0} rot={0} color="#557799" />
      </DriveAlong>

      {/* Cars — secondary roads */}
      <DriveAlong path={SEC_S1} speed={1.15} offset={0.10}>
        <Car x={0} z={0} rot={0} color="#447744" />
      </DriveAlong>
      <DriveAlong path={SEC_N1} speed={1.00} offset={0.60}>
        <Car x={0} z={0} rot={0} color="#664488" />
      </DriveAlong>
      <DriveAlong path={SEC_S2} speed={0.90} offset={0.35}>
        <Car x={0} z={0} rot={0} color="#CC5544" />
      </DriveAlong>
      <DriveAlong path={SEC_N2} speed={0.85} offset={0.80}>
        <Car x={0} z={0} rot={0} color="#447755" />
      </DriveAlong>
      <DriveAlong path={EW_W}   speed={1.05} offset={0.50}>
        <Car x={0} z={0} rot={0} color="#885533" />
      </DriveAlong>

      {/* Tricycles — secondary E-W roads, slower weave */}
      <DriveAlong path={SEC_E1} speed={0.62} offset={0.15}>
        <Tricycle x={0} z={0} rot={0} color="#FF8800" />
      </DriveAlong>
      <DriveAlong path={SEC_W1} speed={0.58} offset={0.58}>
        <Tricycle x={0} z={0} rot={0} color="#EE7700" />
      </DriveAlong>
      <DriveAlong path={NS_N}   speed={0.70} offset={0.30}>
        <Tricycle x={0} z={0} rot={0} color="#FF6600" />
      </DriveAlong>
    </>
  )
}

// ── Clouds revolving around Mt. Isarog ────────────────────────────────────────
function Cloud({ x=0, y=0, z=0, s=1 }: { x?:number; y?:number; z?:number; s?:number }) {
  return (
    <group position={[x, y, z]} scale={s}>
      <mesh castShadow>
        <sphereGeometry args={[1.0, 7, 5]} />
        <meshLambertMaterial color="#E8EFF8" transparent opacity={0.82} />
      </mesh>
      <mesh position={[0.95, 0.10, 0]}>
        <sphereGeometry args={[0.72, 7, 5]} />
        <meshLambertMaterial color="#F0F5FC" transparent opacity={0.76} />
      </mesh>
      <mesh position={[-0.88, 0.05, 0]}>
        <sphereGeometry args={[0.65, 7, 5]} />
        <meshLambertMaterial color="#EDF3FA" transparent opacity={0.72} />
      </mesh>
      <mesh position={[0.18, 0.30, 0.40]}>
        <sphereGeometry args={[0.58, 7, 5]} />
        <meshLambertMaterial color="#F5F9FC" transparent opacity={0.68} />
      </mesh>
      <mesh position={[-0.30, 0.22, -0.38]}>
        <sphereGeometry args={[0.50, 6, 4]} />
        <meshLambertMaterial color="#EEF4FA" transparent opacity={0.65} />
      </mesh>
    </group>
  )
}

function IsarogClouds() {
  const ring1 = useRef<THREE.Group>(null)
  const ring2 = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (ring1.current) ring1.current.rotation.y += dt * 0.12
    if (ring2.current) ring2.current.rotation.y -= dt * 0.07
  })
  return (
    <group position={[0, 0, -26]}>
      {/* Inner ring — mid-slope */}
      <group ref={ring1}>
        <Cloud x={ 0}    y={11.5} z={ 9.5} s={1.10} />
        <Cloud x={ 9.5}  y={10.5} z={ 0}   s={1.00} />
        <Cloud x={ 0}    y={11.0} z={-9.5}  s={1.05} />
        <Cloud x={-9.5}  y={10.8} z={ 0}   s={0.95} />
        <Cloud x={ 6.8}  y={12.0} z={ 6.8} s={0.90} />
        <Cloud x={-6.8}  y={10.5} z={-6.8} s={0.85} />
      </group>
      {/* Outer ring — lower, drifting opposite direction */}
      <group ref={ring2}>
        <Cloud x={ 12.0} y={ 8.5} z={ 4.0} s={1.20} />
        <Cloud x={-4.0}  y={ 8.0} z={12.0} s={1.15} />
        <Cloud x={-12.0} y={ 8.5} z={-4.0} s={1.10} />
        <Cloud x={ 4.0}  y={ 8.0} z={-12.0} s={1.05} />
      </group>
    </group>
  )
}

// ── Atmosphere controller (always rendered — smoothly lerps sky + fog) ────────
function AtmosphereController({ festival }: { festival: boolean }) {
  const { scene, gl } = useThree()
  const prog = useRef(0)
  const day  = useMemo(() => new THREE.Color('#1A2535'), [])
  const fest = useMemo(() => new THREE.Color('#180C08'), [])
  const cur  = useMemo(() => new THREE.Color('#1A2535'), [])
  useFrame(() => {
    prog.current += ((festival ? 1 : 0) - prog.current) * 0.038
    cur.lerpColors(day, fest, prog.current)
    if (scene.background instanceof THREE.Color) scene.background.copy(cur)
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(cur)
    gl.setClearColor(cur, 1)
  })
  return null
}

// ── Festival Mode ─────────────────────────────────────────────────────────────

function FestivalPennantString({ from, to, height=2.8 }: {
  from:[number,number]; to:[number,number]; height?:number
}) {
  const dx = to[0]-from[0], dz = to[1]-from[1]
  const len = Math.sqrt(dx*dx+dz*dz)
  const mid: [number,number,number] = [(from[0]+to[0])/2, height, (from[1]+to[1])/2]
  const heading = Math.atan2(dx, dz)
  const count = Math.max(5, Math.round(len*2.2))
  const colors = ['#7B3038','#C29A51','#7B3038','#C29A51','#F5F0E5','#C29A51']
  return (
    <group>
      <mesh position={mid} rotation={[0, heading, 0]}>
        <boxGeometry args={[0.01, 0.01, len]} />
        <meshLambertMaterial color="#8B7050" />
      </mesh>
      {Array.from({length: count}, (_, i) => {
        const t = i/(count-1)
        const px = from[0]+t*dx, pz = from[1]+t*dz
        const sag = Math.sin(t*Math.PI)*0.06
        return (
          <mesh key={i} position={[px, height-0.07-sag, pz]} rotation={[0, heading, 0]}>
            <boxGeometry args={[0.07, 0.15, 0.02]} />
            <meshLambertMaterial color={colors[i%colors.length]} />
          </mesh>
        )
      })}
    </group>
  )
}

function FestivalBunting() {
  const ref  = useRef<THREE.Group>(null)
  const prog = useRef(0)
  useFrame((_, dt) => {
    prog.current = Math.min(1, prog.current + dt * 1.0)
    if (ref.current) {
      const ease = 1 - Math.pow(1 - prog.current, 3)
      ref.current.position.y = (1 - ease) * 4.2
    }
  })
  const nsZ = [-8,-6,-4,-2,0,2,4,6,8]
  const ewX = [-8,-6,-4,-2,2,4,6,8]
  return (
    <group ref={ref} position={[0, 4.2, 0]}>
      {nsZ.map((z,i) => (
        <FestivalPennantString key={`ns${i}`} from={[-2.8,z]} to={[2.8,z]} height={2.9} />
      ))}
      {ewX.map((x,i) => (
        <FestivalPennantString key={`ew${i}`} from={[x,-2.8]} to={[x,2.8]} height={2.9} />
      ))}
      {([-3.5,-1.5,1.5,3.5] as number[]).map((x,i) => (
        <FestivalPennantString key={`sec${i}`} from={[x, 3.8]} to={[x, 5.8]} height={2.6} />
      ))}
    </group>
  )
}

function FestivalRoadOverlay() {
  return (
    <group>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.016,0]}>
        <planeGeometry args={[1.5,34]} />
        <meshLambertMaterial color="#D4920A" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.016,0]}>
        <planeGeometry args={[34,1.5]} />
        <meshLambertMaterial color="#D4920A" transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.016,4.8]}>
        <planeGeometry args={[20,0.75]} />
        <meshLambertMaterial color="#D4920A" transparent opacity={0.10} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.016,-4.8]}>
        <planeGeometry args={[12,0.75]} />
        <meshLambertMaterial color="#D4920A" transparent opacity={0.10} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]} position={[-5.2,0.016,0]}>
        <planeGeometry args={[0.75,12]} />
        <meshLambertMaterial color="#D4920A" transparent opacity={0.10} depthWrite={false} />
      </mesh>
    </group>
  )
}

function ProcessionCarriage() {
  const silver = '#C2C6CA', silverDk = '#6A7078', silverLt = '#DDE0E4'
  const gold   = '#D4A020', goldLt   = '#F0C040'
  return (
    <group>
      {/* Base platform */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.82, 0.84, 0.10, 14]} />
        <meshLambertMaterial color={silverDk} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.84, 0.84, 0.04, 14]} />
        <meshLambertMaterial color={silverLt} />
      </mesh>
      {/* Main dome */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.76, 16, 12, 0, Math.PI*2, 0, Math.PI*0.60]} />
        <meshLambertMaterial color={silver} />
      </mesh>
      {/* Dome base seal */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.76, 0.76, 0.06, 14]} />
        <meshLambertMaterial color={silverDk} />
      </mesh>
      {/* Dome vertical ribs */}
      {Array.from({length: 12}, (_, i) => {
        const a = (i/12)*Math.PI*2
        return (
          <mesh key={i} position={[Math.cos(a)*0.70, 0.93, Math.sin(a)*0.70]}
                rotation={[0, a+Math.PI/2, 0.33]} castShadow>
            <cylinderGeometry args={[0.013, 0.013, 0.90, 4]} />
            <meshLambertMaterial color={silverDk} />
          </mesh>
        )
      })}
      {/* Sheen band */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.05, 14]} />
        <meshLambertMaterial color={silverLt} />
      </mesh>
      {/* Gold accent at dome top */}
      <mesh position={[0, 1.52, 0]}>
        <cylinderGeometry args={[0.10, 0.10, 0.04, 10]} />
        <meshLambertMaterial color={gold} emissive={gold} emissiveIntensity={0.12} />
      </mesh>
      {/* White flower wreath */}
      <mesh position={[0, 1.50, 0]}>
        <torusGeometry args={[0.22, 0.048, 5, 16]} />
        <meshLambertMaterial color="#F2EDE6" />
      </mesh>
      {Array.from({length: 8}, (_, i) => {
        const a = (i/8)*Math.PI*2
        return (
          <mesh key={i} position={[Math.cos(a)*0.22, 1.51, Math.sin(a)*0.22]}>
            <sphereGeometry args={[0.052, 5, 4]} />
            <meshLambertMaterial color="#FAFAF5" />
          </mesh>
        )
      })}
      {/* Candles around base */}
      {Array.from({length: 8}, (_, i) => {
        const a = (i/8)*Math.PI*2
        return (
          <group key={i} position={[Math.cos(a)*0.70, 0.16, Math.sin(a)*0.70]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.028, 0.028, 0.18, 5]} />
              <meshLambertMaterial color="#F5F0E0" />
            </mesh>
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.022, 4, 3]} />
              <meshLambertMaterial color={goldLt} emissive="#FF6600" emissiveIntensity={0.7} />
            </mesh>
          </group>
        )
      })}
      {/* Our Lady statue on dome */}
      <group position={[0, 1.55, 0]} scale={0.27}>
        <PenafranciaStat />
      </group>
    </group>
  )
}

function DevoteeFigure({ x=0, z=0, shirt='#F2F0EC', headband=false, s=1.0 }: {
  x?:number; z?:number; shirt?:string; headband?:boolean; s?:number
}) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 0.14, 0]} castShadow>
        <boxGeometry args={[0.11, 0.20, 0.09]} />
        <meshLambertMaterial color="#2A2828" />
      </mesh>
      <mesh position={[0, 0.30, 0]} castShadow>
        <boxGeometry args={[0.13, 0.22, 0.10]} />
        <meshLambertMaterial color={shirt} />
      </mesh>
      <mesh position={[0, 0.46, 0]} castShadow>
        <sphereGeometry args={[0.065, 6, 5]} />
        <meshLambertMaterial color="#C89060" />
      </mesh>
      {headband && (
        <mesh position={[0, 0.475, 0]}>
          <torusGeometry args={[0.067, 0.009, 4, 8]} />
          <meshLambertMaterial color="#F0C040" emissive="#D4A020" emissiveIntensity={0.15} />
        </mesh>
      )}
    </group>
  )
}

// Pre-computed scales to avoid Math.random() in render
const DEVOTEE_SCALES = Array.from({length: 56}, (_, i) => 0.88 + (i*13%18)/100)

// All devotee positions (shared by ShoutBubbles)
const DEVOTEE_POS: [number,number][] = [
  ...Array.from({length:10}, (_,i) => { const a=(i/10)*Math.PI*2; return [Math.cos(a)*0.92, Math.sin(a)*0.92] as [number,number] }),
  ...Array.from({length:18}, (_,i) => { const a=(i/18)*Math.PI*2; return [Math.cos(a)*1.48, Math.sin(a)*1.48] as [number,number] }),
  ...Array.from({length:28}, (_,i) => { const a=(i/28)*Math.PI*2; return [Math.cos(a)*2.05, Math.sin(a)*2.05] as [number,number] }),
]

function BubbleSlot({ initIdx, message, phaseOffset }: {
  initIdx: number; message: string; phaseOffset: number
}) {
  const ref   = useRef<THREE.Group>(null)
  const piRef = useRef(initIdx % DEVOTEE_POS.length)
  const bw    = message.length > 5 ? 0.70 : 0.34

  useFrame((state) => {
    const g = ref.current
    if (!g) return
    const cycleT = (state.clock.elapsedTime + phaseOffset) % 4.4
    let s = 0
    if      (cycleT < 0.20) s = (cycleT / 0.20) ** 2
    else if (cycleT < 2.0)  s = 1
    else if (cycleT < 2.20) s = 1 - ((cycleT - 2.0) / 0.20) ** 2

    g.scale.setScalar(s)

    // Jump to a new devotee while hidden
    if (cycleT > 2.8 && cycleT < 2.85) {
      piRef.current = (piRef.current + 11) % DEVOTEE_POS.length
      const [px, pz] = DEVOTEE_POS[piRef.current]
      g.position.x = px
      g.position.z = pz
    }
  })

  const [ix, iz] = DEVOTEE_POS[piRef.current]
  return (
    <Billboard position={[ix, 0.75, iz]}>
      <group ref={ref} scale={0}>
        {/* Gold border */}
        <mesh position={[0, 0, -0.004]}>
          <planeGeometry args={[bw+0.06, 0.28]} />
          <meshBasicMaterial color="#C29A51" transparent opacity={0.55} depthWrite={false} />
        </mesh>
        {/* White bubble body */}
        <mesh>
          <planeGeometry args={[bw, 0.22]} />
          <meshBasicMaterial color="#FAFAF5" transparent opacity={0.93} depthWrite={false} />
        </mesh>
        {/* Tail (pointing down) */}
        <mesh position={[0.04, -0.14, 0]} rotation={[0, 0, Math.PI/4]}>
          <planeGeometry args={[0.07, 0.07]} />
          <meshBasicMaterial color="#FAFAF5" transparent opacity={0.93} depthWrite={false} />
        </mesh>
        <Text position={[0, 0, 0.005]} fontSize={0.080} color="#7B3038"
          anchorX="center" anchorY="middle">
          {message}
        </Text>
      </group>
    </Billboard>
  )
}

function ShoutBubbles() {
  return (
    <>
      <BubbleSlot initIdx={2}  message="Viva La Virgen!" phaseOffset={0.00} />
      <BubbleSlot initIdx={13} message="Viva!"           phaseOffset={1.10} />
      <BubbleSlot initIdx={26} message="Viva La Virgen!" phaseOffset={2.20} />
      <BubbleSlot initIdx={40} message="Viva!"           phaseOffset={3.30} />
      <BubbleSlot initIdx={7}  message="Viva!"           phaseOffset={0.55} />
    </>
  )
}

function ProcessionGroup() {
  const groupRef = useRef<THREE.Group>(null)
  const domeRef  = useRef<THREE.Group>(null)
  const progRef  = useRef(0)

  useFrame((state, dt) => {
    // Spring scale-in on mount
    progRef.current = Math.min(1, progRef.current + dt * 0.85)
    if (groupRef.current) {
      const p = progRef.current
      // ease-in to 1.10 then settle to 1.0 (spring overshoot)
      const s = p < 0.72
        ? p / 0.72
        : p < 0.86
          ? 1.0 + (p - 0.72) / 0.14 * 0.10
          : 1.10 - (p - 0.86) / 0.14 * 0.10
      groupRef.current.scale.setScalar(s)
    }
    // Gentle bob on the dome
    if (domeRef.current)
      domeRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.012
  })

  const innerRing = Array.from({length:10}, (_,i) => {
    const a=(i/10)*Math.PI*2, shirts=['#FFFFFF','#F0F0E8','#FFFFFF']
    return { x:Math.cos(a)*0.92, z:Math.sin(a)*0.92, shirt:shirts[i%3], hb:i%3===0 }
  })
  const midRing = Array.from({length:18}, (_,i) => {
    const a=(i/18)*Math.PI*2, shirts=['#F2F0EC','#FFFFFF','#E8E8E0','#FFFFFF']
    return { x:Math.cos(a)*1.48, z:Math.sin(a)*1.48, shirt:shirts[i%4], hb:i%4===1 }
  })
  const outerRing = Array.from({length:28}, (_,i) => {
    const a=(i/28)*Math.PI*2, shirts=['#F8F8F4','#FFFFFF','#F0F0E8']
    return { x:Math.cos(a)*2.05, z:Math.sin(a)*2.05, shirt:shirts[i%3], hb:i%6===3 }
  })
  const all = [...innerRing, ...midRing, ...outerRing]

  return (
    <group ref={groupRef} scale={0}>
      <group ref={domeRef}>
        <ProcessionCarriage />
      </group>
      {all.map((d,i) => (
        <DevoteeFigure key={i} x={d.x} z={d.z} shirt={d.shirt} headband={d.hb}
          s={DEVOTEE_SCALES[i % DEVOTEE_SCALES.length]} />
      ))}
      <ShoutBubbles />
    </group>
  )
}

function FestivalProcession() {
  const path: [number,number][] = [
    [  0,  11],
    [  0,   0],
    [ 11,   0],
    [  0,   0],
    [  0, -11],
    [  0,   0],
    [-11,   0],
    [  0,   0],
    [  0,  11],
  ]
  return (
    <DriveAlong path={path} speed={0.13} offset={0}>
      <ProcessionGroup />
    </DriveAlong>
  )
}

function AnimatedFestivalLight({ position, color, maxIntensity, distance, decay }: {
  position:[number,number,number]; color:string; maxIntensity:number; distance:number; decay:number
}) {
  const lightRef = useRef<THREE.PointLight>(null)
  const prog     = useRef(0)
  useFrame((_, dt) => {
    prog.current = Math.min(1, prog.current + dt * 0.55)
    if (lightRef.current) lightRef.current.intensity = prog.current * maxIntensity
  })
  return <pointLight ref={lightRef} position={position} color={color} intensity={0}
    distance={distance} decay={decay} />
}

function FestivalMode() {
  return (
    <>
      <AnimatedFestivalLight position={[0,6,0]}   color="#FF9030" maxIntensity={0.55} distance={32} decay={1.5} />
      <AnimatedFestivalLight position={[7,5,6]}   color="#FFB040" maxIntensity={0.40} distance={18} decay={2.0} />
      <AnimatedFestivalLight position={[-5,5,-5]} color="#FF8020" maxIntensity={0.35} distance={20} decay={2.0} />
      <FestivalRoadOverlay />
      <FestivalBunting />
      <FestivalProcession />
    </>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────
export function CityMap() {
  const { selectedDestination, setLoading, penafranciaModeActive } = useAppStore()

  const zones = [
    { id:'quincemart' as DestinationId, pos:[7,0,-5]   as [number,number,number], name:'Plaza Quince Martires', color:'#7B3038' },
    { id:'basilica'   as DestinationId, pos:[7,0,6]    as [number,number,number], name:'Basilica Minore',       color:'#7B3038' },
    { id:'kinalas'    as DestinationId, pos:[-7,0,6]   as [number,number,number], name:'Kinalas Trail',         color:'#B96848' },
    { id:'robredo'    as DestinationId, pos:[-7,0,-6]  as [number,number,number], name:'Robredo Museum',        color:'#C29A51' },
    { id:'isarog'     as DestinationId, pos:[0,0,-26]  as [number,number,number], name:'Mt. Isarog',            color:'#315B43' },
  ]

  return (
    <Canvas orthographic
      camera={{ position:[20,20,20], zoom:ISO_ZOOM, near:1, far:320 }}
      gl={{ alpha:false }}
      shadows dpr={[1,1.5]}
      onCreated={({ camera, gl }) => {
        camera.lookAt(0,0,0)
        gl.setClearColor(0x1A2535, 1)
        setTimeout(() => setLoading(false), 600)
      }}
      aria-label="Isometric map of Naga City"
    >
      <color attach="background" args={['#1A2535']} />
      <fog attach="fog" color="#1A2535" near={90} far={130} />

      <AtmosphereController festival={penafranciaModeActive} />
      <CameraController />

      <Suspense fallback={null}>
        <Lighting />
        <Ground />
        <Fence />
        <WelcomeArch />
        <StreetTrees />
        <StreetLamps />
        <SurroundingCity />
        {!penafranciaModeActive && <Vehicles />}
        <WalkingPeople />
        <QuinceMartiresZone selected={selectedDestination === 'quincemart'} />
        <BasilicaZone  selected={selectedDestination === 'basilica'} />
        <KinalasZone   selected={selectedDestination === 'kinalas'} />
        <RobredoZone   selected={selectedDestination === 'robredo'} />
        <IsarogZone    selected={selectedDestination === 'isarog'} />
        <IsarogClouds />
        {penafranciaModeActive && <FestivalMode />}
        {zones.map(z => (
          <ZoneHitArea key={z.id} destId={z.id} position={z.pos}
            name={z.name} color={z.color}
            selected={selectedDestination === z.id} />
        ))}
      </Suspense>
    </Canvas>
  )
}
