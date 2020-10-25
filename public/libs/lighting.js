class LightingLayer{
    constructor(){
        this.lightLayer = null;
        this.lighting_sprites = null;
    }

    setup(width,height,sprites){
        this.lightLayer = createGraphics(width,height);
        this.lighting_sprites = sprites;
        this.lightLayer.imageMode(CENTER);
        this.lightLayer.translate(width/2,height/2);
    }

    startRender(){
        this.lightLayer.blendMode(BLEND);
        this.lightLayer.background(0);
        this.lightLayer.blendMode(ADD);
    }

    //renders a beam at point and angle, range is how far it goes, width is how wide it is
    renderLightBeam(pos,angle,range=500,width=250,tintColor = null){
        let lightBeam = this.lighting_sprites.beam;
        this.lightLayer.push();
        this.lightLayer.translate(pos.x,pos.y);
        this.lightLayer.rotate(angle);
        this.lightLayer.translate(range/2,0);
        if(tintColor != null) this.lightLayer.tint(tintColor);
        this.lightLayer.image(lightBeam,0,0,range,width);
        this.lightLayer.pop();
    }

    renderPointLight(pos,radius=20,tintColor = null){
        let lightPoint = this.lighting_sprites.point;
        this.lightLayer.push();
        this.lightLayer.translate(pos.x,pos.y);
        if(tintColor != null) this.lightLayer.tint(tintColor);
        this.lightLayer.image(lightPoint,0,0,radius,radius);
        this.lightLayer.pop();
    }

    renderImage(lightImage,pos,width,height,tint=255){
        this.lightLayer.push();
        this.lightLayer.translate(pos.x,pos.y);
        this.lightLayer.tint(tint);
        this.lightLayer.image(lightImage,0,0,width,height);
        this.lightLayer.pop();
    }

    renderVignette(width,height){
        let lightPoint = this.lighting_sprites.point;
        this.lightLayer.blendMode(MULTIPLY);
        this.lightLayer.image(lightPoint,0,0,width,height);
    }


    render(){
        blendMode(MULTIPLY);
        image(this.lightLayer,0,0);
        blendMode(BLEND);
    }
}