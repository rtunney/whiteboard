var color = {'H':'#aaaaaa', 'C':'#222222', 'N':'#2233ff', 'O':'#ff2200', 'F':'#55bb00', 'Cl':'#55bb00', 'Br':'#992200', 'I':'#6600bb', 'He':'#00ffff', 'Ne':'#00ffff', 'Ar':'#00ffff', 'Kr':'#00ffff', 'Xe':'#00ffff', 'Rn':'#00ffff', 'P':'#ff9900', 'S':'#dddd00', 'Li':'#7700ff', 'Na':'#7700ff', 'K':'#7700ff', 'Rb':'#7700ff', 'Cs':'#7700ff', 'Be':'#007700', 'Mg':'#007700', 'Ca':'#007700', 'Sr':'#007700', 'Ba':'#007700', 'Ra':'#007700', 'Ti':'#999999', 'Fe':'#dd7700'};
var valence = {'H':1, 'He':0, 'Li':1, 'Be':2, 'B':3, 'C':4, 'N':3, 'O':2, 'F':1, 'Ne':0, 'Na':1, 'Mg':2, 'Al':3, 'Si':4, 'P':5, 'S':6, 'Cl':5, 'Ar':0, 'K':1, 'Ca':2, 'Sc':3, 'Ti':4, 'V':5, 'Cr':6, 'Mn':4, 'Fe':4, 'Co':4, 'Ni':4, 'Cu':2, 'Zn':2, 'Ga':3, 'Ge':4, 'As':5, 'Se':6, 'Br':5, 'Kr':2, 'Rb':1, 'Sr':2, 'Y':3, 'Zr':4, 'Nb':5, 'Mo':6, 'Tc':6, 'Ru':6, 'Rh':6, 'Pd':4, 'Ag':3, 'Cd':2, 'In':3, 'Sn':4, 'Sb':5, 'Te':6, 'I':7, 'Xe':6, 'Cs':1, 'Ba':2, 'La':3, 'Ce':4, 'Pr':4, 'Nd':3, 'Pm':3, 'Sm':3, 'Eu':3, 'Gd':3, 'Tb':4, 'Dy':3, 'Ho':3, 'Er':3, 'Tm':3, 'Yb':3, 'Lu':3, 'Hf':4, 'Ta':5, 'W':6, 'Re':7, 'Os':6, 'Ir':6, 'Pt':6, 'Au':5, 'Hg':4, 'Tl':3, 'Pb':4, 'Bi':5, 'Po':6, 'At':7, 'Rn':6, 'Fr':1, 'Ra':2, 'Ac':3, 'Th':4, 'Pa':5, 'U':6, 'Np':6, 'Pu':6, 'Am':4, 'Cm':4, 'Bk':4, 'Cf':4, 'Es':4, 'Fm':3, 'Md':3, 'No':3, 'Lr':3, 'Rf':4, 'Db':5, 'Sg':6, 'Bh':7, 'Hs':7, 'Mt':7, 'Ds':7, 'Rg':7, 'Cn':6, 'Uut':5, 'Uuq':4}
var atoms = [];

var toDeg = function(x){
    return x*180/Math.PI;
}

var toRad = function(x){
    return x*Math.PI/180;
}

var findAtom = function(x, y) {
    for (var i=0; i<atoms.length; i++) {
        var atom = atoms[i];
        if (Math.sqrt(Math.pow(x-atom.x, 2) + Math.pow(y-atom.y, 2))<10) {
            console.log(atom);
            return atom;
        }
    }
    return null;
}

var findAngle = function(dx, dy, angles){
    var clickAngle = toDeg(Math.atan2(dy, dx));
    if (clickAngle>0) { clickAngles = [clickAngle, clickAngle-360]; }
    else if (clickAngle===0) { clickAngles = [-360, 0, 360]; }
    else if (clickAngle<0) { clickAngles = [clickAngle, clickAngle+360]; }
    var nearestAngle = null;
    var minDifference = 360;
    for (var i=0; i<angles.length; i++) {
        for (var j=0; j<clickAngles.length; j++) {
            var difference = Math.abs(angles[i]-clickAngles[j]);
            if(difference<minDifference) {
                minDifference = difference;
                nearestAngle = angles[i];
            }
        }
    }
    return nearestAngle;
}

var toFront = function(node){
    var parent = node.parentNode;
    parent.removeChild(node);
    parent.appendChild(node);
}

var toBack = function(node){
    var parent = node.parentNode;
    parent.insertBefore(node, parent.childNodes[0]);
}

var mode = 'none';

var setMode = function(e){
    mode=e.target.name; 
    console.log("mode: " + mode);
}; 

var atomData = function(mode, baseAng, x, y, g){
    switch(mode) {
        case 'atom':
            this.x = x;
            this.y = y;
            this.element = '[enter]';
            this.maxValence = 4;
            this.curValence = 0;
            this.baseAng = 0;
            this.singleAngs = [30, 150, 270];
            this.doubleAngs = [30, 150, 270];
            this.tripleAngs = [0, 180];
            this.singles = 0;
            this.g = g;
            this.text = g.firstChild;
            break;
        
        case 'single': case 'wedge': case 'dash':
            this.x = x;
            this.y = y;
            this.element = 'C';
            this.maxValence = 4;
            this.curValence = 1;
            this.baseAng = (baseAng+180)%360;
            this.singleAngs = [(this.baseAng+120)%360, (this.baseAng+240)%360];
            this.doubleAngs = [(this.baseAng+120)%360, (this.baseAng+240)%360];
            this.tripleAngs = [(this.baseAng+180)%360];
            this.singles = 1;
            this.g = g;
            toBack(this.g);
            this.text = g.firstChild;
            this.text.style.fill = '#ffffff';
            break;

        case 'double':
            this.x = x;
            this.y = y;
            this.element = 'C';
            this.maxValence = 4;
            this.curValence = 2;
            this.baseAng = (baseAng+180)%360;
            this.singleAngs = [(this.baseAng+120)%360, (this.baseAng+240)%360];
            this.doubleAngs = [(this.baseAng+180)%360];
            this.tripleAngs = [];
            this.singles = 0;
            this.g = g;
            this.text = g.firstChild;
            break;

        case 'triple':
            this.x = x;
            this.y = y;
            this.element = 'C';
            this.maxValence = 4;
            this.curValence = 3;
            this.baseAng = (baseAng+180)%360;
            this.singleAngs = [(this.baseAng+180)%360];
            this.doubleAngs = [];
            this.tripleAngs = [];
            this.singles = 0;
            this.g = g;
            this.text = g.firstChild;
            break;
    };
};
var elementMaker = {};

elementMaker.none = function(){};

elementMaker.delete = function(){};

elementMaker.atom = function(x, y, baseAng){
    x = x-5; y = y+7;
    d3.select('#whiteboard')
    .append('g')
    .attr('class', 'atom')
    .attr('id', 'current')
    .attr('transform', 'translate(' + x + ", " + y + ")")
    .attr('enable-background', 'new');

    var current = d3.select('#current');

    current.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('style', 'font-family:Arial, Helvetica, sans-serif; font-size:14px;')
    .text('[enter]');

    var text = current[0][0].firstChild;

    var sourceAtom = findAtom(x, y);
    if (baseAng) {}
    else if (sourceAtom) { var baseAng = atom.baseAng; }
    else { var baseAng = 0; }

    var atom = new atomData(mode, baseAng, x, y-5, current[0][0]); 
    // var atom = {x+(text.getBBox().width/3), y:y-5, element:null, maxValence:null, curValence:0, baseAng:0, single_angles:[], double_angles:[60, -60], triple_angles:[0], singles:0, g:current[0][0], text:text, removeText:function(){text.textContent='';}};
    atoms.push(atom);

    var clicked = function(e){
        console.log('atom clicked');
        if (mode=='delete') {
            document.getElementById('whiteboard').removeChild(current[0][0]);
            atoms.splice(atoms.indexOf(atom), 1);
        }
        else {
            console.log('request to change element text');
            var oldtxt = current[0][0].firstChild.textContent;
            var txtinput = document.createElement('input');
            txtinput.setAttribute('type', 'text');
            txtinput.setAttribute('style', 'width:50px;');
            
            var isElement = function(symbol){
                return !!valence[txtinput.value];
            }
            var saveInput = function(saveEvt){
                if (saveEvt.type=='blur' || saveEvt.keyCode==13){
                    if (valence[txtinput.value]!==undefined) {
                        text.textContent = txtinput.value;
                        text.style.fill = color[txtinput.value];
                        atom.element = txtinput.value;
                        atom.x = x+text.getBBox().width/2;
                        atom.maxValence = valence[txtinput.value];
                    }
                    try {document.getElementsByTagName('body')[0].removeChild(txtinput);}
                    catch(err){}
                }
            };
            txtinput.addEventListener('keyup', saveInput);
            txtinput.addEventListener('blur', saveInput);
            document.getElementsByTagName('body')[0].appendChild(txtinput);
            txtinput.focus();
            if (e) { e.stopPropagation();}
        }; 
    };

    document.getElementById('current').addEventListener('click', clicked);
    current.attr('id', null);
    clicked();
}

elementMaker.benzene = function(x, y){
    d3.select('#whiteboard')
    .append('g')
    .attr('class', 'benzene')
    .attr('id', 'current')
    .attr('transform', 'translate(' + (x+69) + ', ' + (y-20) + ') rotate (90 0 0)')

    var current = d3.select('#current');

    current.append('polygon')
    .attr('points', "20,0  60,0  80,35  60,69  20,69  0,35")
    .attr('style', "stroke:#333; stroke-width:3; fill:none;");
    
    current.append('line')
    .attr('x1', 23)
    .attr('y1', 5)
    .attr('x2', 57)
    .attr('y2', 5)
    .attr('style', "stroke:#333;");

    current.append('line')
    .attr('x1', 6)
    .attr('y1', 35)
    .attr('x2', 23)
    .attr('y2', 64)
    .attr('style', "stroke:#333;");

    current.append('line')
    .attr('x1', 57)
    .attr('y1', 64)
    .attr('x2', 74)
    .attr('y2', 35)
    .attr('style', "stroke:#333;");

    current.attr('id', null);
};

elementMaker.single = function(x, y) {
    var atom = findAtom(x, y);
    if (atom) { 
        console.log("x: " + x);
        console.log("y: " + y);
        console.log("atom.x: " + atom.x);
        console.log("atom.y: " + atom.y);
        var dx = x-atom.x;
        var dy = atom.y-y;
        var x = atom.x; 
        var y = atom.y; 
        if (atom.element=='C') {
            atom.text.style.fill = '#fff';
        }
        atom.singles+=1;
    }

    console.log(dx);
    console.log(dy);
    console.log(atom.singleAngs);
    console.log(findAngle(dx, dy, atom.singleAngs));

    var rotate = findAngle(dx, dy, atom.singleAngs);

    d3.select('#whiteboard')
    .append('g')
    .attr('class', 'single')
    .attr('id', 'current')
    .attr('transform', 'translate(' + x + ', ' + y + ') rotate(' + (-1*rotate) + ' 0 0)');

    var current = d3.select('#current');

    current.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 40)
    .attr('y2', 0)
    .attr('style', "stroke:#333; stroke-width:3;");

    current.attr('id', null);

    elementMaker.atom(x + Math.round(40*Math.cos(toRad(rotate))), y - Math.round(40*Math.sin(toRad(rotate))) - 2, rotate);
}

elementMaker.double = function(x, y) {
    d3.select('#whiteboard')
    .append('g')
    .attr('class', 'double')
    .attr('id', 'current')
    .attr('transform', 'translate(' + x + ", " + y + ")");

    var current = d3.select('#current');

    current.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 40)
    .attr('y2', 0)
    .attr('style', "stroke:#333; stroke-width:2;");

    current.append('line')
    .attr('x1', 0)
    .attr('y1', 5)
    .attr('x2', 40)
    .attr('y2', 5)
    .attr('style', "stroke:#333; stroke-width:2;");

    current.attr('id', null);
}

elementMaker.triple = function(x, y) {
    d3.select('#whiteboard')
    .append('g')
    .attr('class', 'triple')
    .attr('id', 'current')
    .attr('transform', 'translate(' + x + ", " + y + ")");

    var current = d3.select('#current');

    current.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 40)
    .attr('y2', 0)
    .attr('style', "stroke:#333; stroke-width:1;");

    current.append('line')
    .attr('x1', 0)
    .attr('y1', 3)
    .attr('x2', 40)
    .attr('y2', 3)
    .attr('style', "stroke:#333; stroke-width:1;");

    current.append('line')
    .attr('x1', 0)
    .attr('y1', 6)
    .attr('x2', 40)
    .attr('y2', 6)
    .attr('style', "stroke:#333; stroke-width:1;");

    current.attr('id', null);
}

elementMaker.wedge = function(x, y) {
    d3.select('#whiteboard')
    .append('g')
    .attr('class', 'wedge')
    .attr('id', 'current')
    .attr('transform', 'translate(' + x + ", " + y + ")");

    var current = d3.select('#current');

    current.append('polygon')
    .attr('points', "0,3  40,0  40,6")
    .attr('style', "stroke:#333; fill:#333;");

    current.attr('id', null);
}

elementMaker.dash = function(x, y) {
    d3.select('#whiteboard')
    .append('g')
    .attr('class', 'dash')
    .attr('id', 'current')
    .attr('transform', 'translate(' + x + ", " + y + ")");

    var current = d3.select('#current');

    current.append('line')
    .attr('x1', 0)
    .attr('y1', 3)
    .attr('x2', 0)
    .attr('y2', 4)
    .attr('style', "stroke:#333; stroke-width:1;");

    current.append('line')
    .attr('x1', 8)
    .attr('y1', 3)
    .attr('x2', 8)
    .attr('y2', 4)
    .attr('style', "stroke:#333; stroke-width:1;");

    current.append('line')
    .attr('x1', 16)
    .attr('y1', 2)
    .attr('x2', 16)
    .attr('y2', 5)
    .attr('style', "stroke:#333; stroke-width:1;");

    current.append('line')
    .attr('x1', 24)
    .attr('y1', 2)
    .attr('x2', 24)
    .attr('y2', 5)
    .attr('style', "stroke:#333; stroke-width:1;");

    current.append('line')
    .attr('x1', 32)
    .attr('y1', 1)
    .attr('x2', 32)
    .attr('y2', 6)
    .attr('style', "stroke:#333; stroke-width:1;");

    current.append('line')
    .attr('x1', 40)
    .attr('y1', 0)
    .attr('x2', 40)
    .attr('y2', 7)
    .attr('style', "stroke:#333; stroke-width:1;");

    current.attr('id', null);
}
var addElement = function(e){ 
    console.log("Adding " + mode + " element.");
    // console.log(mode);
    console.log(e.offsetX-5);
    console.log(e.offsetY-5);
    elementMaker[mode](e.offsetX-5, e.offsetY-5);
};

var demoElements = function(){
    elementMaker.benzene(10, 45);
    elementMaker.single(100, 10);
    elementMaker.double(100, 20);
    elementMaker.triple(100, 40);
    elementMaker.wedge(160, 10);
    elementMaker.dash(160, 30);
    elementMaker.atom(220, 14);
}

$(document).ready(function(){
    $('button').click(setMode);
    $('#whiteboard').click(addElement);
    // demoElements();
});