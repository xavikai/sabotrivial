import asyncio, random, sys
from playwright.async_api import async_playwright
BASE='http://localhost:8765/'
FAKE=open(__import__('os').path.join(__import__('os').path.dirname(__file__) or '.', 'fakepeer.js')).read()
MEM="""(()=>{const m={};const s={getItem:k=>k in m?m[k]:null,setItem:(k,v)=>{m[k]=String(v)},removeItem:k=>{delete m[k]},clear:()=>{for(const k in m)delete m[k]}};Object.defineProperty(window,'localStorage',{value:s,configurable:true});})();"""
errors=[]
async def mkpage(ctx, name):
    p=await ctx.new_page()
    await p.add_init_script(MEM)
    await p.route('**/js/vendor/peerjs.min.js*', lambda r: r.fulfill(body=FAKE, content_type='application/javascript'))
    await p.route('https://fonts.**', lambda r: r.abort())
    p.on('pageerror', lambda e: errors.append(f'{name}: {e}'))
    p.on('console', lambda m: errors.append(f'{name} console: {m.text}') if m.type=='error' else None)
    return p
async def profile(p, name, av_idx, lvl):
    await p.fill('#pname', name)
    await p.locator(f'#plevels [data-lvl="{lvl}"]').click()
async def drive(pages, rounds):
    for _ in range(rounds):
        for p in pages:
            try:
                for sel in ['[data-a="answer"]','[data-a="ready"]','#modal [data-a="move"]']:
                    loc=p.locator(sel); n=await loc.count()
                    if n: await loc.nth(random.randrange(n)).click(timeout=1000); break
                else:
                    tg=p.locator('.hx.tg'); n=await tg.count()
                    if n:
                        if random.random()<0.4:
                            c=p.locator('.gcard.can')
                            if await c.count():
                                await c.first.click(); await asyncio.sleep(0.2)
                                t=p.locator('#modal [data-a="playcard"]')
                                if await t.count(): await t.first.click(); await asyncio.sleep(0.3); continue
                        await tg.nth(random.randrange(n)).dispatch_event('click')
            except Exception as e: pass
        await asyncio.sleep(0.3)
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch()
        ctx=await b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2)
        host=await mkpage(ctx,'host')
        await host.goto(BASE); await asyncio.sleep(0.5)
        await host.screenshot(path='/tmp/shots/01_home.png')
        await host.click('[data-a="go"][data-to="create"]')
        await profile(host,'Xavi',0,3)
        await host.screenshot(path='/tmp/shots/02_profile.png')
        await host.click('[data-a="docreate"]'); await asyncio.sleep(0.6)
        code=(await host.locator('.roomcode b').inner_text()).strip()
        print('code',code)
        clients=[]
        for i,(n,lv) in enumerate([('Mama',3),('Pol',2),('Pau',1)]):
            c=await mkpage(ctx,n); await c.goto(BASE+'?sala='+code); await asyncio.sleep(0.3)
            await profile(c,n,i+2,lv); await c.click('[data-a="dojoin"]'); await asyncio.sleep(0.5)
            clients.append(c)
        await asyncio.sleep(0.5)
        await host.screenshot(path='/tmp/shots/03_lobby_host.png', full_page=True)
        await clients[2].screenshot(path='/tmp/shots/04_lobby_client.png', full_page=True)
        await host.click('[data-a="cfg"][data-k="time"][data-val="15"]')
        await host.click('[data-a="start"]'); await asyncio.sleep(1)
        allp=[host]+clients
        await host.screenshot(path='/tmp/shots/05_board_start.png')
        for k in range(2):
            await drive(allp, 8)
            await allp[k%4].screenshot(path=f'/tmp/shots/06_board_{k}.png')
        # forçar escenari: posar un jugador a la vora de la meta
        st=await host.evaluate('(()=>{const S=__TP.S;return {step:S.step,turn:S.turn,round:S.round,pos:S.players.map(p=>p.pos)}})()')
        print(st)
        await host.evaluate('(()=>{const S=__TP.S;S.round=S.map.rounds;})()')
        for _ in range(40):
            await drive(allp, 6)
            if await host.evaluate('__TP.S.phase')=='end': break
        await asyncio.sleep(2)
        st=await host.evaluate('(()=>{const S=__TP.S;return {phase:S.phase,winner:S.winner}})()')
        print(st)
        await host.screenshot(path='/tmp/shots/07_end_host.png', full_page=True)
        await clients[1].screenshot(path='/tmp/shots/07_end_client.png', full_page=True)
        # quiz
        if st['phase']=='end':
            await host.click('[data-a="restart"]'); await asyncio.sleep(0.5)
            await host.click('[data-a="cfg"][data-k="mode"][data-val="quiz"]')
            await host.click('[data-a="cfg"][data-k="rounds"][data-val="6"]')
            await host.click('[data-a="start"]'); await asyncio.sleep(3)
            await clients[0].screenshot(path='/tmp/shots/08_quiz_q.png')
            await drive(allp, 3)
            await asyncio.sleep(0.3)
            await clients[0].screenshot(path='/tmp/shots/09_quiz_reveal.png')
            await asyncio.sleep(4)
            await clients[1].screenshot(path='/tmp/shots/10_quiz_scores.png')
            for _ in range(30):
                await drive(allp, 6)
                if await host.evaluate('__TP.S.phase')=='end': break
            await asyncio.sleep(2)
            await host.screenshot(path='/tmp/shots/11_quiz_end.png', full_page=True)
            print(await host.evaluate('__TP.S.phase'), await host.evaluate('__TP.S.round'))
        print('ERRORS', errors[:20])
        await b.close()
asyncio.run(main())
