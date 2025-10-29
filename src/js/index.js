(function(){
  function qs(a,b){return (b||document).querySelector(a)}
  function qsa(a,b){return Array.from((b||document).querySelectorAll(a))}
  function on(el,ev,fn){el.addEventListener(ev,fn)}
  function Modal(root){
    this.root = root; this.backdrop = root.querySelector('.modal-backdrop'); this.dialog = root.querySelector('.modal-dialog');
    var self=this;
    this.show = function(){ self.root.classList.add('show'); self.root.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
    this.hide = function(){ self.root.classList.remove('show'); self.root.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };
    on(this.root,'click',function(e){ if(e.target===self.root || e.target===self.backdrop){ self.hide(); }});
    on(document,'keydown',function(e){ if(e.key==='Escape' && self.root.classList.contains('show')) self.hide(); });
  }
  function Dropdown(toggle){
    this.toggle = toggle; this.menu = toggle.nextElementSibling;
    var self=this;
    this.open=function(){ self.menu.classList.add('show'); };
    this.close=function(){ self.menu.classList.remove('show'); };
    this.toggleMenu=function(){ self.menu.classList.toggle('show'); };
    on(document,'click',function(e){ if(!self.menu.contains(e.target) && !self.toggle.contains(e.target)) self.close(); });
    on(toggle,'click',function(e){ e.preventDefault(); self.toggleMenu(); });
  }
  function Collapse(toggle){
    this.target = qs(toggle.getAttribute('data-target'));
    var self=this;
    this.toggle=function(){ if(!self.target) return; var open=self.target.getAttribute('data-open')==='true';
      if(open){ self.target.style.height='0px'; self.target.setAttribute('data-open','false'); }
      else { self.target.style.height=self.target.scrollHeight+'px'; self.target.setAttribute('data-open','true'); }
    };
    on(toggle,'click',function(e){ e.preventDefault(); self.toggle(); });
  }
  function initModals(){
    qsa('[data-modal]').forEach(function(el){
      var m = new Modal(el);
      // bind openers that reference this modal by id
      var sel = '[data-modal-open=" #' + el.id + '"] , [data-modal-open="#' + el.id + '"]';
      qsa(sel.replace('  ', ' ')).forEach(function(btn){ on(btn,'click',function(){ m.show(); }); });
      // close buttons inside the modal
      qsa('[data-modal-close]', el).forEach(function(btn){ on(btn,'click',function(){ m.hide(); }); });
    });
  }
  function initDropdowns(){ qsa('[data-dropdown]').forEach(function(t){ new Dropdown(t); }); }
  function initCollapses(){ qsa('[data-collapse]').forEach(function(t){ new Collapse(t); }); }
  function initAll(){ initModals(); initDropdowns(); initCollapses(); }
  window.ferzui = { initAll: initAll };
  if(document.readyState!=='loading') initAll(); else on(document,'DOMContentLoaded',initAll);
})();
