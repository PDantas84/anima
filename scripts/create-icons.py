"""Render Anima's original geometric mark into native app assets (Pillow)."""
from PIL import Image, ImageDraw
from math import cos, sin, pi
from pathlib import Path
Path('assets').mkdir(exist_ok=True)
def mark(size, transparent=False):
    k=3
    im=Image.new('RGBA',(size*k,size*k),(0,0,0,0) if transparent else '#241C2A'); d=ImageDraw.Draw(im)
    def pt(x,y): return ((x/1024)*size*k,(y/1024)*size*k)
    if not transparent:
        for r in range(700,0,-4):
            t=1-r/700; color=(int(36+t*14),int(28+t*9),int(42+t*12),255)
            d.ellipse((*pt(512-r,480-r),*pt(512+r,480+r)),fill=color)
    cx,cy=512,480
    for angle in [-pi/6,pi/6]:
        points=[]
        for i in range(241):
            t=i*2*pi/240; x,y=120*cos(t),248*sin(t)
            points.append(pt(cx+x*cos(angle)-y*sin(angle),cy+x*sin(angle)+y*cos(angle)))
        d.line(points,fill='#DFBCAB',width=max(1,int(5*size*k/1024)),joint='curve')
    d.line([pt(512,252),pt(512,782)],fill='#DFBCAB',width=max(1,int(5*size*k/1024)))
    d.ellipse((*pt(472,440),*pt(552,520)),outline='#DFBCAB',width=max(1,int(5*size*k/1024)))
    return im.resize((size,size),Image.Resampling.LANCZOS)
mark(1024).convert('RGB').save('assets/icon.png')
mark(1024,True).save('assets/adaptive-icon.png')
mark(512,True).save('assets/splash-mark.png')
