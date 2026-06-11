
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// ============================
//  SCENE SETUP
// ============================
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2('#050816', 0.020)

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 200)
camera.position.set(0, 4, 9)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
renderer.setSize(innerWidth, innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enablePan   = false
controls.minDistance = 4
controls.maxDistance = 18
controls.maxPolarAngle = Math.PI * 0.55

// ============================
//  LIGHTS
// ============================
scene.add(new THREE.AmbientLight(0x6a5acd, 0.5))

const sun = new THREE.DirectionalLight(0x99ccff, 1.8)
sun.position.set(8, 14, 6)
sun.castShadow = true
sun.shadow.mapSize.set(1024, 1024)
sun.shadow.camera.near = 0.5
sun.shadow.camera.far  = 80
sun.shadow.camera.left   = -22
sun.shadow.camera.right  =  22
sun.shadow.camera.top    =  22
sun.shadow.camera.bottom = -22
scene.add(sun)

const fill = new THREE.DirectionalLight(0xff6030, 0.4)
fill.position.set(-8, 4, -10)
scene.add(fill)

const rimLight = new THREE.PointLight(0x00ffff, 1.2, 22)
rimLight.position.set(0, 6, -2)
scene.add(rimLight)

// ============================
//  STAR FIELD
// ============================
const starVerts = []
for (let i = 0; i < 2400; i++) {
  starVerts.push(
    (Math.random() - 0.5) * 320,
    (Math.random() - 0.5) * 320,
    (Math.random() - 0.5) * 320
  )
}
const starGeo = new THREE.BufferGeometry()
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3))
const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.28, sizeAttenuation: true })
)
scene.add(stars)

// ============================
//  GROUND
// ============================
const groundMat = new THREE.MeshStandardMaterial({
  color: '#0a0f2c', emissive: '#050e1e', roughness: 0.7, metalness: 0.3
})
const ground = new THREE.Mesh(new THREE.BoxGeometry(22, 0.5, 120), groundMat)
ground.position.y = -1.5
ground.receiveShadow = true
scene.add(ground)

const gridHelper = new THREE.GridHelper(22, 22, 0x003366, 0x001133)
gridHelper.position.y = -1.24
scene.add(gridHelper)

// Lane marker lines
for (let x = -8; x <= 8; x += 4) {
  const lineMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.01, 110),
    new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x006666 })
  )
  lineMesh.position.set(x, -1.23, 0)
  scene.add(lineMesh)
}

// ============================
//  Kreiranje modela
// ============================
function buildHero() {
  const g = new THREE.Group()

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x3399ff, emissive: 0x001133, metalness: 0.6, roughness: 0.3
  })
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x00ffff, emissive: 0x00cccc, metalness: 0.8, roughness: 0.1
  })
  const gunMat = new THREE.MeshStandardMaterial({
    color: 0x222244, emissive: 0x000088, metalness: 0.9, roughness: 0.1
  })

  // Torso
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.45), bodyMat)
  body.castShadow = true; body.position.y = 0.45; g.add(body)

  // Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.45), bodyMat)
  head.castShadow = true; head.position.y = 1.15; g.add(head)

  // Visor
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.08), visorMat)
  visor.position.set(0, 1.18, 0.25); g.add(visor)

  // Left arm
  const lArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 0.2), bodyMat)
  lArm.position.set(-0.45, 0.35, 0); lArm.castShadow = true; g.add(lArm)

  // Right arm
  const rArm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 0.2), bodyMat)
  rArm.position.set(0.45, 0.35, 0); rArm.castShadow = true; g.add(rArm)

  // Gun barrel
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.65), gunMat)
  gun.position.set(0.45, 0.55, -0.3); g.add(gun)

  // Legs
  const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.28), bodyMat)
  lLeg.position.set(-0.2, -0.32, 0); lLeg.castShadow = true; g.add(lLeg)

  const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.28), bodyMat)
  rLeg.position.set(0.2, -0.32, 0); rLeg.castShadow = true; g.add(rLeg)

  // Jet packs
  const jetL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.4, 8), gunMat)
  jetL.position.set(-0.3, 0.3, -0.25); g.add(jetL)

  const jetR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.4, 8), gunMat)
  jetR.position.set(0.3, 0.3, -0.25); g.add(jetR)

  return g
}

// ============================
//  Enemy 3 tipa
// ============================
function buildEnemy(type) {
  const g = new THREE.Group()

  const col = type === 0 ? 0xff3333 : type === 1 ? 0xff9900 : 0xcc00ff
  const emi = type === 0 ? 0x660000 : type === 1 ? 0x441100 : 0x440044
  const m   = new THREE.MeshStandardMaterial({ color: col, emissive: emi, metalness: 0.5, roughness: 0.3 })
  const eyeM = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffaa00 })

  if (type === 0) {
    // Spider-ish alien
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), m)
    body.castShadow = true; g.add(body)

    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 4), eyeM)
    eyeL.position.set(-0.18, 0.15, 0.38); g.add(eyeL)

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 4), eyeM)
    eyeR.position.set(0.18, 0.15, 0.38); g.add(eyeR)

    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 4), m)
      leg.rotation.z = Math.PI / 4 * (i % 2 === 0 ? 1 : -1)
      leg.position.set(i < 2 ? -0.42 : 0.42, -0.38, i % 2 === 0 ? 0.15 : -0.15)
      g.add(leg)
    }

  } else if (type === 1) {
    // Humanoid robot
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.5), m)
    body.castShadow = true; body.position.y = 0.45; g.add(body)

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.42, 0.42), m)
    head.position.y = 1.15; g.add(head)

    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.1), eyeM)
    eyeL.position.set(-0.12, 1.18, 0.22); g.add(eyeL)

    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.1), eyeM)
    eyeR.position.set(0.12, 1.18, 0.22); g.add(eyeR)

    const aL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.72, 0.2), m)
    aL.position.set(-0.45, 0.42, 0); g.add(aL)

    const aR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.72, 0.2), m)
    aR.position.set(0.45, 0.42, 0); g.add(aR)

    const lL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.62, 0.26), m)
    lL.position.set(-0.2, -0.3, 0); g.add(lL)

    const lR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.62, 0.26), m)
    lR.position.set(0.2, -0.3, 0); g.add(lR)

  } else {
    // Alien tripod
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 1.0, 6), m)
    body.castShadow = true; g.add(body)

    const top = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.55, 6), m)
    top.position.y = 0.77; g.add(top)

    const eye = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.045, 8, 16), eyeM)
    eye.position.set(0, 0.2, 0.32); eye.rotation.x = Math.PI / 2; g.add(eye)

    for (let i = 0; i < 3; i++) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.55, 0.09), m)
      leg.position.set(
        Math.cos(i * Math.PI * 2 / 3) * 0.46,
        -0.77,
        Math.sin(i * Math.PI * 2 / 3) * 0.46
      )
      g.add(leg)
    }
  }

  return g
}

// ============================
//  PARTICLE SYSTEM
// ============================
const particles = []

function spawnParticles(pos, color, count = 9) {
  for (let i = 0; i < count; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 4, 4),
      new THREE.MeshStandardMaterial({ color, emissive: color })
    )
    p.position.copy(pos)
    p.vel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.22,
       Math.random() * 0.16 + 0.04,
      (Math.random() - 0.5) * 0.22
    )
    p.life = 0.7 + Math.random() * 0.5
    scene.add(p)
    particles.push(p)
  }
}

// Muzzle flash
function muzzleFlash(pos) {
  const fl = new THREE.PointLight(0x00ffff, 3.5, 4)
  fl.position.copy(pos)
  scene.add(fl)
  setTimeout(() => scene.remove(fl), 65)
}

// ============================
//  FLOATING SCORE TEXTS
// ============================
const floatingTexts = []

function spawnFloat(pos, text, color = '#ffd700') {
  const div = document.createElement('div')
  div.style.cssText = `
    position: absolute;
    font-family: 'Press Start 2P', monospace;
    font-size: 12px;
    color: ${color};
    pointer-events: none;
    text-shadow: 0 0 10px ${color};
    white-space: nowrap;
  `
  div.innerText = text
  document.body.appendChild(div)
  floatingTexts.push({ div, pos: pos.clone(), life: 1.3, vy: 0.018 })
}

function updateFloatingTexts() {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i]
    ft.life -= 0.022
    ft.pos.y += ft.vy
    if (ft.life <= 0) { ft.div.remove(); floatingTexts.splice(i, 1); continue }
    const v = ft.pos.clone().project(camera)
    const x = (v.x * 0.5 + 0.5) * innerWidth
    const y = (-v.y * 0.5 + 0.5) * innerHeight
    ft.div.style.left  = x + 'px'
    ft.div.style.top   = y + 'px'
    ft.div.style.opacity = ft.life
  }
}

// Kill feed
function killFeed(msg, color = '#ffd700') {
  const div = document.createElement('div')
  div.className = 'kf-item'
  div.style.color = color
  div.innerText = msg
  document.getElementById('kill-feed').appendChild(div)
  setTimeout(() => div.remove(), 2200)
}

// ============================
//  GAME STATE
// ============================
let gameRunning  = false
let hero         = null
let heroVelocityY = 0
let jumpCount    = 0
const maxJumps   = 3
const keys       = {}
const enemies    = []
const bullets    = []
let lastShot     = 0
const shootCooldown = 175  // ms

let score   = 0
let health  = 3
let maxHealth = 3
let frames  = 0
let animId
let invincible = false

let wave              = 1
let waveKills         = 0
let waveKillsNeeded   = 10

let spawnRate      = 60
let enemyBaseSpeed = 0.07
let difficulty     = 'medium'

let combo      = 0
let comboTimer = 0

let playerLevel = 1
let xp          = 0
let xpNeeded    = 20

let ammo       = 30
const maxAmmo  = 30
let reloading  = false
let reloadProgress = 0

let lastTime = 0

// ============================
//  DIFFICULTY
// ============================
function setDifficulty(level) {
  difficulty = level
  document.querySelectorAll('.diff-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.level === level)
  })
  if (level === 'easy')   { spawnRate = 100; enemyBaseSpeed = 0.04 }
  if (level === 'medium') { spawnRate = 60;  enemyBaseSpeed = 0.07 }
  if (level === 'pro')    { spawnRate = 28;  enemyBaseSpeed = 0.13 }
}
setDifficulty('medium')

document.querySelectorAll('.diff-btn').forEach(b => {
  b.onclick = () => setDifficulty(b.dataset.level)
})

// ============================
//  HERO
// ============================
hero = buildHero()
hero.position.set(0, 0, 0)
hero.rotation.y = Math.PI
scene.add(hero)

// ============================
//  SPAWN ENEMY
// ============================
function spawnEnemy() {
  const type  = Math.floor(Math.random() * 3)
  const e     = buildEnemy(type)
  const scale = 0.65 + Math.random() * 1.1
  e.scale.set(scale, scale, scale)
  e.position.set((Math.random() - 0.5) * 18, 0, -44)
  e.speed = (enemyBaseSpeed + Math.random() * 0.03) * (1 + wave * 0.05)
  e.type  = type
  e.hp    = type + 1
  e.maxHp = type + 1
  e.userData.bobOffset = Math.random() * Math.PI * 2
  scene.add(e)
  enemies.push(e)
}

// ============================
//  SHOOT
// ============================
function shoot() {
  if (!hero || reloading) return
  if (ammo <= 0) { startReload(); return }
  const now = Date.now()
  if (now - lastShot < shootCooldown) return
  lastShot = now
  ammo--
  updateAmmoUI()

  const pos = hero.position.clone().add(new THREE.Vector3(0, 1.0, 0))
  muzzleFlash(pos)

  const b = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.85),
    new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff })
  )
  b.position.copy(pos)
  b.speed = 0.95
  scene.add(b)
  bullets.push(b)

  // Tiny camera shake
  camera.position.x += (Math.random() - 0.5) * 0.035
  camera.position.y += (Math.random() - 0.5) * 0.015
}

function startReload() {
  if (reloading || ammo === maxAmmo) return
  reloading = true
  reloadProgress = 0
  document.getElementById('ammo-el').innerText = 'Reloading...'
}

function updateAmmoUI() {
  document.getElementById('ammo-el').innerText = `Ammo: ${ammo} / ${maxAmmo}`
}

// ============================
//  COLLISION HELPERS
// ============================
function bulletHit(bullet, enemy) {
  return bullet.position.distanceTo(enemy.position) < enemy.scale.x * 0.95
}

function heroHit(a, b) {
  return a.position.distanceTo(b.position) < 1.35
}

// ============================
//  HUD UPDATE
// ============================
function updateHUD() {
  document.getElementById('score-el').innerText  = 'Score: ' + score
  document.getElementById('health-el').innerText = 'Lives: ' + '❤️'.repeat(Math.max(0, health))
  document.getElementById('wave-el').innerText   = 'Wave: ' + wave

  const comboEl = document.getElementById('combo-el')
  comboEl.innerText = combo > 1 ? 'Combo x' + combo + '!' : ''

  document.getElementById('xp-bar').style.width =
    Math.min(100, (xp / xpNeeded) * 100) + '%'
  document.getElementById('xp-label').innerText =
    'Level ' + playerLevel + ' — XP ' + xp + ' / ' + xpNeeded

  const hpPct = Math.max(0, (health / maxHealth) * 100)
  document.getElementById('health-bar').style.width = hpPct + '%'
  document.getElementById('health-bar-label').innerText = 'HP  ' + health + ' / ' + maxHealth
}

function gainXP(amount) {
  xp += amount
  if (xp >= xpNeeded) {
    xp -= xpNeeded
    playerLevel++
    xpNeeded = Math.floor(xpNeeded * 1.5)
    maxHealth = Math.min(maxHealth + 1, 8)
    health    = Math.min(health + 1, maxHealth)
    const lu = document.getElementById('level-up-msg')
    lu.style.display = 'block'
    setTimeout(() => lu.style.display = 'none', 1800)
    killFeed('★ LEVEL UP! HP +1', '#a78bfa')
  }
}

// ============================
//  MAIN GAME LOOP
// ============================
function animate(ts = 0) {
  animId = requestAnimationFrame(animate)
  const dt = Math.min(ts - lastTime, 50) / 16.67
  lastTime = ts

  controls.update()
  stars.rotation.y += 0.00008

  // Reload progress
  if (reloading) {
    reloadProgress += 0.013
    const pct = Math.min(100, Math.floor(reloadProgress * 100))
    document.getElementById('ammo-el').innerText = `Reloading ${pct}%`
    if (reloadProgress >= 1) {
      reloading = false
      ammo = maxAmmo
      updateAmmoUI()
    }
  }

  if (!gameRunning) {
    renderer.render(scene, camera)
    return
  }

  // ---- HERO MOVEMENT ----
  const sprinting = keys['ShiftLeft'] || keys['ShiftRight']
  const spd = (sprinting ? 0.18 : 0.12) * dt

  heroVelocityY += -0.006 * dt
  hero.position.y += heroVelocityY * dt
  if (hero.position.y <= 0) {
    hero.position.y = 0
    heroVelocityY   = 0
    jumpCount       = 0
  }

  if (keys['KeyA'] && hero.position.x > -9) hero.position.x -= spd
  if (keys['KeyD'] && hero.position.x <  9) hero.position.x += spd
  if (keys['KeyW'] && hero.position.z > -4) hero.position.z -= spd * 0.5
  if (keys['KeyS'] && hero.position.z <  4) hero.position.z += spd * 0.5
  hero.position.x = Math.max(-9, Math.min(9, hero.position.x))

  // Hero tilt
  const targetTiltX = keys['KeyW'] ? -0.14 : keys['KeyS'] ? 0.09 : 0
  const targetTiltZ = keys['KeyA'] ? 0.12  : keys['KeyD'] ? -0.12 : 0
  hero.rotation.x += (targetTiltX - hero.rotation.x) * 0.12
  hero.rotation.z += (targetTiltZ - hero.rotation.z) * 0.12

  // Camera soft follow hero X
  const targetCamX = hero.position.x * 0.22
  camera.position.x += (targetCamX - camera.position.x) * 0.05

  // ---- COMBO TIMER ----
  if (combo > 0) {
    comboTimer -= dt
    if (comboTimer <= 0) combo = 0
  }

  // ---- BULLETS ----
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i]
    b.position.z -= b.speed * dt
    b.rotation.z += 0.18
    if (b.position.z < -85) { scene.remove(b); bullets.splice(i, 1) }
  }

  // ---- ENEMIES ----
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i]
    e.position.z += e.speed * dt
    e.position.y  = Math.abs(Math.sin(frames * 0.03 + e.userData.bobOffset)) * 0.12
    e.rotation.y += 0.025 * dt

    // Bullet hits enemy
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (bulletHit(bullets[j], e)) {
        spawnParticles(
          e.position.clone(),
          e.type === 0 ? 0xff3333 : e.type === 1 ? 0xff9900 : 0xcc00ff
        )
        scene.remove(bullets[j])
        bullets.splice(j, 1)
        e.hp--

        if (e.hp <= 0) {
          combo++
          comboTimer = 2.6
          const pts = 10 * (e.type + 1) * (combo > 2 ? combo : 1)
          score    += pts
          waveKills++
          gainXP(e.type + 1)

          spawnFloat(
            e.position.clone(),
            combo > 1 ? `+${pts} x${combo}!` : `+${pts}`,
            combo > 2 ? '#ff00ff' : '#ffd700'
          )
          killFeed(
            combo > 2 ? `COMBO x${combo}! +${pts}` : `+${pts} pts`,
            combo > 2 ? '#ff00ff' : '#ffd700'
          )

          scene.remove(e)
          enemies.splice(i, 1)
        }
        break
      }
    }

    // Check still exists after bullet loop
    if (!enemies[i]) continue

    // Enemy reaches / hits hero
    if (heroHit(hero, e) && !invincible) {
      health--
      combo = 0
      spawnParticles(hero.position.clone().add(new THREE.Vector3(0, 0.8, 0)), 0xff4444, 14)
      scene.remove(e)
      enemies.splice(i, 1)
      invincible = true

      let blinks = 0
      const blink = setInterval(() => {
        if (hero) hero.visible = !hero.visible
        blinks++
        if (blinks > 14) {
          clearInterval(blink)
          if (hero) hero.visible = true
          invincible = false
        }
      }, 90)

      if (health <= 0) return endGame()
      continue
    }

    if (enemies[i] && e.position.z > 14) {
      scene.remove(e)
      enemies.splice(i, 1)
    }
  }

  // ---- PARTICLES ----
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.position.addScaledVector(p.vel, dt)
    p.vel.y -= 0.007 * dt
    p.life  -= 0.03 * dt
    p.material.opacity = p.life
    p.material.transparent = true
    if (p.life <= 0) { scene.remove(p); particles.splice(i, 1) }
  }

  // ---- WAVE SYSTEM ----
  if (waveKills >= waveKillsNeeded) {
    wave++
    waveKills = 0
    waveKillsNeeded = Math.floor(waveKillsNeeded * 1.4 + 5)
    killFeed('★★ WAVE ' + wave + ' ★★', '#00ffff')
    spawnFloat(
      new THREE.Vector3(hero.position.x, hero.position.y + 2.5, hero.position.z),
      'WAVE ' + wave + '!',
      '#00ffff'
    )
  }

  // ---- ENEMY SPAWN ----
  const effectiveRate = Math.max(18, spawnRate - wave * 2)
  if (frames % effectiveRate === 0) {
    spawnEnemy()
    if (difficulty === 'pro' || wave > 3) spawnEnemy()
    if (wave > 6) spawnEnemy()
  }

  frames++
  updateHUD()
  updateFloatingTexts()
  renderer.render(scene, camera)
}

// ============================
//  END GAME
// ============================
function endGame() {
  gameRunning = false
  cancelAnimationFrame(animId)
  const overlay = document.getElementById('overlay')
  overlay.style.display = 'flex'
  document.getElementById('overlay-title').innerText = 'GAME OVER'
  document.getElementById('overlay-sub').innerHTML =
    `Wave: ${wave} &nbsp;|&nbsp; Level: ${playerLevel}<br>Max Combo: ${combo}`
  document.getElementById('overlay-score').innerText = 'Final Score: ' + score
  const btn = document.getElementById('start-btn')
  btn.innerText = '► PLAY AGAIN'
  btn.onclick = () => location.reload()
}

// ============================
//  INPUT
// ============================
window.addEventListener('keydown', e => {
  keys[e.code] = true
  if (e.code === 'Space' && gameRunning) {
    if (jumpCount < maxJumps) { heroVelocityY = 0.14; jumpCount++ }
  }
  if (e.code === 'KeyF' && gameRunning) shoot()
  if (e.code === 'KeyR' && gameRunning) startReload()
})

window.addEventListener('keyup', e => { keys[e.code] = false })

// ============================
//  START BUTTON
// ============================
document.getElementById('start-btn').onclick = () => {
  document.getElementById('overlay').style.display = 'none'
  gameRunning = true
  updateAmmoUI()
  updateHUD()
  animate()
}

// Initial render (show scene before start)
renderer.render(scene, camera)

// Resize
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})
