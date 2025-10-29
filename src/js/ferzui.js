// ferzui v0.1.0 - core JS interactions
(function(){
  function qs(sel,root=document){return root.querySelector(sel)}
  function qsa(sel,root=document){return Array.from(root.querySelectorAll(sel))}

  // Modal
  qsa([data-fz-modal-target]).forEach(btn=>{
    btn.addEventListener(click,()=>{
      const target = btn.getAttribute(data-fz-modal-target)
      const el = qs(target)
      if(el){ el.classList.add(show) }
    })
  })
  qsa([data-fz-dismiss=modal]).forEach(btn=>{
    btn.addEventListener(click,()=>{
      const backdrop = btn.closest(.modal-backdrop)
      if(backdrop){ backdrop.classList.remove(show) }
    })
  })

  // Dropdown
  qsa([data-fz-toggle=dropdown]).forEach(toggle=>{
    toggle.addEventListener(click,()=>{
      const menu = toggle.nextElementSibling
      if(menu && menu.classList.contains(dropdown-menu)){
        menu.classList.toggle(show)
      }
    })
  })
  document.addEventListener(click,(e)=>{
    qsa(.dropdown-menu.show).forEach(menu=>{
      if(!menu.contains(e.target) && !menu.previousElementSibling?.contains(e.target)){
        menu.classList.remove(show)
      }
    })
  })

  // Collapse
  qsa([data-fz-toggle=collapse]).forEach(toggle=>{
    const targetSel = toggle.getAttribute(data-fz-target)
    toggle.addEventListener(click,()=>{
      const target = targetSel ? qs(targetSel) : null
      if(target){ target.classList.toggle(show) }
    })
  })

  // Toast
  function ensureToastStack(){
    let stack = qs(.toast-stack)
    if(!stack){
      stack = document.createElement(div)
      stack.className = toast-stack
      document.body.appendChild(stack)
    }
    return stack
  }
  function showToast(message,{timeout=3000}={}){
    const stack = ensureToastStack()
    const el = document.createElement(div)
    el.className = toast
    el.textContent = message
    stack.appendChild(el)
    setTimeout(()=>{ el.remove() }, timeout)
  }
  window.ferzui = { showToast }
})()
