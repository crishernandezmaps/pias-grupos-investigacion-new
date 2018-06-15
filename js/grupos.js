function drawChart(data) {

  console.log('data')

  var width = 900,
      height = 650,
      padding = 3, // separation between same-color circles
      clusterPadding = 12, // separation between different-color circles
      maxRadius = 11;

  var regreg = data.map((d) => {
    r = {
      lasRegiones: d.region
    };
    z = r.lasRegiones;
    return z.toLowerCase();
  });

  var regiones = _.uniq(regreg)
  console.log(regiones);

  var n = data.length, // nodes
      m = regiones.length, // clusters
      z = d3.scaleOrdinal(d3.schemeCategory20),
      clusters = new Array(m);

  var pallete = ["#ffc60c", "#cc5810", "#558930", "#1f86cc", "#7f3e98", "#717770", "#c68642", "#71d6e7", "#f3800d"];
  var color = d3.scaleOrdinal(pallete);

  // CREDITS: Thanks pmia2 http://blockbuilder.org/pmia2/028815204d5e30fd221355a8e3b46c1e
  var nodes = data.map((d) => {
    var i = +d.regcode, // it has to be a numeric variable. In this case, a number per Region.
        r = maxRadius,
        d = {
          cluster: i,
          radius: r,
          region: d.region.toLowerCase(),
          grupo: d.grupo,
          laboratorio: d.labs,
          servicio: d.services,
          programa: d.programmes,
          proyecto: d.projects,
          publicacion: d.publications,
          investigador: d.researchers,
          nacional: d.netnacional,
          internacional: d.netinternacional,
          redes: d.networks,
          // NUEVAS CATEGORIAS
          a_funcional: d.alimento_funcional,
          a_grup_esp: d.alimento_grupos_especiales,
          adic: d.alimentos_disminuidos_ingredientes_críticos,
          in_func: d.ingredientes_funcionales,
          ad_esp: d.aditivos_especializados,
          inocuidad: d.inocuidad,
          calidad: d.calidad,
          traza: d.trazabilidad,
          mej_gen: d.mejoramiento_genetico,
          sis_pro: d.sistemas_productivos,
          env_int: d.envases_inteligentes,
          env_act: d.envases_activos,
          nue_mat: d.nuevos_materiales,
          nue_sis_env: d.nuevos_sistemas_envasado,
          vuae: d.vida_util_alimentos_envasados,
          sustent: d.sustentabilidad,
          entidad: d.entidad,
          web: d.web_entidad,
          telefono: d.telefono_entidad,
          mail: d.mail_entidad,
          descripcion: d.linea_investigacion_gi,
          inv_responsable: d.inv_responsable,
          // AQUI COMIENZAN LAS CATEGORÍAS
          inocuidad: d.inocuidad,
          ingredientes: d.ingredientes,
          funcionalidad: d.funcionalidad,
          catA: d.catA,
          catB: d.catB,
          x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
        };
        if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
        return d;
  });

  console.log(nodes)

  var simulation = d3.forceSimulation()
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force('cluster', d3.forceCluster().centers(function (d) { return clusters[d.cluster]; }).strength(0.5).centerInertia(0.1))
    .force('collide', d3.forceCollide(function (d) { return d.radius + padding; }))
    .on('tick', layoutTick)
    .nodes(nodes);

  var svg = d3.select('#bubbles')
    .append('svg')
    .attr('class', 'bubls')
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox','0 0 '+Math.min(width)+' '+Math.min(height))
    .attr("preserveAspectRatio", "xMinYMin meet");

  // Tool_tip //
  var content = function(d) {
    return "<span class='ngrupo'>" + d.grupo + "</span>" + "<br/>"
         + "<span>" + d.region + "</span>";
  }

  var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(content);

  svg.call(tool_tip);

  function hide(d) { d3.select("#hidden").html('<h4>Grupo de Investigación: '+ d.grupo +'</h4>'
                                + '<b>Entidad:</b> ' + d.entidad + '</p>'
                                + '<b>Región:</b> ' + d.region + '</p>'
                                + "<h4 id='areInv'>Areas de Investigación:</h4>"
                                + '<ul><li><p>Inocuidad: ' + d.inocuidad + '</p></li>'
                                + '<li><p>Ingredientes críticos: ' + d.ingredientes + '</p></li>'
                                + '<li><p>Funcionalidad alimentaria: ' + d.funcionalidad + '</p></li>'
                                + '<li><p>catA: ' + d.catA + '</p></li>'
                                + '<li><p>catB: ' + d.catB + '</p></li></ul>'
                                + "<h4 id='areInv'>Capacidades:</h4>"
                                + '<b>Laboratorios:</b> ' + d.laboratorio + '<br/>'
                                + '<b>Servicios:</b> ' + d.servicio + '<br/>'
                                + '<b>Programas:</b> ' + d.programa + '<br/>'
                                + '<b>Proyectos:</b> ' + d.proyecto + '<br/>'
                                + '<b>Publicaciones:</b> ' + d.publicacion + '<br/>'
                                + '<b>Investigadores:</b> ' + d.investigador + '<br/>'
                                + '<b>Redes Nacionales:</b> ' + d.nacional + '<br/>'
                                + '<b>Redes Internacionales:</b> ' + d.internacional + '<br/>'
                                + '<br/>'
                                + "<h4 id='areInv'>Información:</h4>"
                                + '<b>* Investigador(es) Responsable(s):</b> ' + d.inv_responsable + '<br/>'
                                + '<b>* Teléfono de contacto:</b> ' + d.telefono + '<br/>'
                                + '<b>* Correo electrónico:</b>' + "<a class='more' href='mailto:" + d.mail + "'> " + d.mail + '</a><br/>'
                                + '<b>* Web:</b>' + "<a class='more' target='_blank' href='" + d.web + "'> " + d.web + '</a><br/>'
                                + '<b>* Linea de Investigación:</b> ' + d.descripcion
                                + "<br/><br/><p>Más información <a class='more-but' target='_blank' href=" + d.web + ">aquí</a></p>")}

  function addStroke(d) {
    d.clicked = true;
    return node
      .style("stroke", function(d) { return d.clicked ? "red" : "rgba(19,19,19,0.2)"; })
      .style('stroke-width', function(d) { return d.clicked * 4 });
  }

  function classing(d){
    d.clicked = false;
    return node
      .style("stroke-width", function(d) { return d.clicked ? "red" : "#131313"; });
  }

  var node = svg.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
      .attr('class', 'nodo')
      .attr('r', function (d) { return d.radius; })
      .attr('fill', function (d) { return color(d.cluster/m) })
      .attr("data-legend",function(d) { return d.region})
      .on('click',function(d){ hide(d); addStroke(d); classing(d) })
      .on('mouseover', tool_tip.show)
      .on('mouseout', tool_tip.hide);

  node.transition()
    .duration(700)
    .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

  function layoutTick (e) {
    node
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
  }

  // Filters ///////////////////////////////
  var r = 650,
      l = 450,
      a = 0.08,
      ab = 0.01,
      s = 0.5,
      w = 1.5,
      pos = 60,
      cap = 5;

  // Regions //////////////////////////////////
  d3.select('#arp').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'arica-parinacota'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#tar').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'tarapaca'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#ant').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'antofagasta'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#ata').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'atacama'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#coq').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'coquimbo'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#val').on('click',function() {
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force("y", d3.forceY(function(d){if(d.region == 'valparaiso'){ return l } else { return r } }).strength(s))
    .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
    .alphaTarget(a)
    .restart();
  });

  d3.select('#met').on('click',function() {
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force("y", d3.forceY(function(d){if(d.region == 'santiago'){ return l } else { return r } }).strength(s))
    .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
    .alphaTarget(a)
    .restart();
  });

  d3.select('#ohi').on('click',function() {
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force("y", d3.forceY(function(d){if(d.region == 'ohiggins'){ return l } else { return r } }).strength(s))
    .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
    .alphaTarget(a)
    .restart();
  });

  d3.select('#mau').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'maule'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#bio').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'bio-bio'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#ara').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'araucania'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#los').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'los-rios'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#lor').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'los-lagos'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#ays').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'aysen'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  d3.select('#mag').on('click',function() {
      simulation
      .force('center', d3.forceCenter(width/2, height/2.3))
      .force("y", d3.forceY(function(d){if(d.region == 'magallanes'){ return l } else { return r } }).strength(s))
      .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
      .alphaTarget(a)
      .restart();
  });

  // Areas ////////////////////////////
  // TRANSFORMAR ESTAS FUNCIONES EN LAS FUNCIONES QUE SERAN LOS NUEVOS MENÚ //////////////////////////////////////////////////////////////////
  d3.select('#af').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#age').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#ric').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#if').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#ae').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#i').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#c').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#t').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#mg').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#sp').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#o').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#ei').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#ea').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#nm').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#ifu').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#nse').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#vuae').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  d3.select('#s').on('click',function(){ node.style('opacity',function(d) { if(d.a_funcional == 'Si'){ return 1 } else{ return 0.2} }) })
  // TRANSFORMAR ESTAS FUNCIONES EN LAS FUNCIONES QUE SERAN LOS NUEVOS MENÚ //////////////////////////////////////////////////////////////////

  var pallete2 = ["#F4C2C2", "#FF6961", "#FF5C5C", "#FF1C00", "#FF0800", "#FF0000", "#CD5C5C", "#E34234", "#D73B3E","#CE1620","#CC0000","#B22222","#B31B1B","#A40000","#800000","#701C1C","#3C1414","#321414"];
  var color2 = d3.scaleOrdinal(pallete2);

  // Capacidades //////////////////////////////////////
  d3.select("#lab").on('click',function(){
    var x = 1
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force('collide', d3.forceCollide(function (d) { return d.laboratorio * (x+0.1) }))
    .alphaTarget(ab)
    .restart();
    node
      .attr('r',function(d) { return d.laboratorio })
  })

  d3.select('#ser').on('click',function(){
    var x = 4
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force('collide', d3.forceCollide(function (d) { return d.servicio * (x+0.3) }))
    .alphaTarget(ab)
    .restart();
    node
      .attr('r',function(d) { return d.servicio * x })
  })

  d3.select('#prog').on('click',function(){
    var x = 6
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force('collide', d3.forceCollide(function (d) { return d.programa * x }))
    .alphaTarget(0)
    .restart();
    node
      .attr('r',function(d) { return d.programa * x })
  })

  d3.select('#proj').on('click',function(){
    var x = 2
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force('collide', d3.forceCollide(function (d) { return d.proyecto * (x+0.3) }))
    .alphaTarget(0)
    .restart();
    node
      .attr('r',function(d) { return d.proyecto * x })
  })

  d3.select('#pub').on('click',function(){
    var x = 0.7
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force('collide', d3.forceCollide(function (d) { return d.publicacion * (x+0.3) }))
    .alphaTarget(0)
    .restart();
    node
      .attr('r',function(d) { return d.publicacion * x })
  })

  d3.select('#inv').on('click',function(){
    var x = 3
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force('collide', d3.forceCollide(function (d) { return d.investigador * (x+0.3) }))
    .alphaTarget(0)
    .restart();
    node
      .attr('r',function(d) { return d.investigador * x })
  })

  d3.select('#nac').on('click',function(){
    var x = 3
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force('collide', d3.forceCollide(function (d) { return d.nacional * (x+0.3) }))
    .alphaTarget(0)
    .restart();
    node
      .attr('r',function(d) { return d.nacional * x })
  })

  d3.select('#ext').on('click',function(){
    var x = 2
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force('collide', d3.forceCollide(function (d) { return d.internacional * (x+0.3) }))
    .alphaTarget(0)
    .restart();
    node
      .attr('r',function(d) { return d.internacional * x })
  })

}; ////////////////////////////////// D3 - END //////////////////////////////////
////////////////////////////////// Tabletop //////////////////////////////////
var url = "https://docs.google.com/spreadsheets/d/1YnjA9q59i9CRErzvPL0fKEOAOGX5lvcf9ANO_oEfQTw/edit#gid=0"
var pias = '1YnjA9q59i9CRErzvPL0fKEOAOGX5lvcf9ANO_oEfQTw'
var options = { key: pias, simpleSheet: true, callback: draw }
function renderSpreadsheetData() { Tabletop.init(options) }
function draw(data, tabletop) { drawChart(data) }
renderSpreadsheetData();
////////////////////////////////// Tabletop - END//////////////////////////////////
