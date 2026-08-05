
  const canvas = document.getElementById('net');
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [];
  const NODE_COUNT = 55;
  const LINK_DIST = 140;
  const mouse = { x: null, y: null };

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
  resize();

  function initNodes(){
    nodes = [];
    for(let i=0;i<NODE_COUNT;i++){
      nodes.push({
        x: Math.random()*w,
        y: Math.random()*Math.min(h, window.innerHeight),
        vx: (Math.random()-0.5)*0.25,
        vy: (Math.random()-0.5)*0.25
      });
    }
  }
  initNodes();

  document.addEventListener('mousemove', (e)=>{
    mouse.x = e.clientX;
    mouse.y = e.clientY + window.scrollY;
  });
  document.addEventListener('mouseleave', ()=>{ mouse.x=null; mouse.y=null; });

  function step(){
    ctx.clearRect(0,0,w,h);

    for(const n of nodes){
      n.x += n.vx;
      n.y += n.vy;
      if(n.x < 0 || n.x > w) n.vx *= -1;
      if(n.y < 0 || n.y > Math.min(h, window.innerHeight+200)) n.vy *= -1;
    }

    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < LINK_DIST){
          ctx.strokeStyle = `rgba(57,255,140,${0.14 * (1 - dist/LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
      if(mouse.x !== null){
        const dx = nodes[i].x-mouse.x, dy = nodes[i].y-mouse.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < 180){
          ctx.strokeStyle = `rgba(57,255,140,${0.35 * (1-dist/180)})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    for(const n of nodes){
      ctx.fillStyle = 'rgba(57,255,140,0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.6, 0, Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }
  step();

