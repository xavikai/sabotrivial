import asyncio
exec(open('test/e2e.py').read().split('async def main')[0])
async def main():
    async with async_playwright() as pw:
        b=await pw.chromium.launch()
        ctx=await b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2)
        p=await mkpage(ctx,'local'); await p.goto(BASE); await asyncio.sleep(0.3)
        await p.click('[data-a="go"][data-to="local"]')
        for n,lv in [('Xavi',3),('Anna',3),('Pol',2),('Laia',1)]:
            await p.fill('#lname',n); await p.click(f'.addp [data-lvl="{lv}"]'); await p.click('[data-a="ladd"]'); await asyncio.sleep(0.1)
        await p.screenshot(path='/tmp/shots/20_local_lobby.png', full_page=True)
        await p.click('[data-a="start"]'); await asyncio.sleep(0.8)
        # efectes forçats al primer jugador
        await p.evaluate("(()=>{const S=__TP.S;const c=S.players[S.turn];c.eff.dizzy=true;c.eff.ink=true;c.cards=['banana','shield','fifty','mirror']; __TPchanged();})()")
        await p.evaluate("__TP.S.toast={n:999,e:'🍌',t:'prova'}")
        await p.click('.gcard.can >> nth=0'); await asyncio.sleep(0.3)
        await p.screenshot(path='/tmp/shots/21_card_modal.png')
        await p.click('#modal [data-a="playcard"] >> nth=0'); await asyncio.sleep(0.5)
        await p.click('[data-a="roll"]'); await asyncio.sleep(2.3)
        await p.screenshot(path='/tmp/shots/22_dizzy_ink.png')
        await asyncio.sleep(5)
        await p.screenshot(path='/tmp/shots/23_dizzy_after.png')
        # duel forçat
        await p.evaluate("(()=>{const S=__TP.S;})()")
        print(await p.evaluate('[__TP.S.step, __TP.S.ask && __TP.S.ask.kind]'))
        await p.click('[data-a="answer"] >> nth=0'); await asyncio.sleep(0.5)
        await p.screenshot(path='/tmp/shots/24_reveal.png')
        # bomba sobre el següent
        await asyncio.sleep(8)
        print(await p.evaluate('[__TP.S.step, __TP.S.turn]'))
        await p.evaluate("(()=>{const S=__TP.S;const c=S.players[S.turn];c.cards=['bomb'];__TPchanged();})()")
        await p.evaluate("(()=>{})()")
        await asyncio.sleep(0.5)
        if await p.locator('.gcard.can').count():
            await p.click('.gcard.can >> nth=0'); await asyncio.sleep(0.2)
            await p.click('#modal [data-a="playcard"] >> nth=0'); await asyncio.sleep(0.6)
            await p.screenshot(path='/tmp/shots/25_gate.png')
        print('ERR',errors)
        # escriptori
        ctx2=await b.new_context(viewport={'width':1366,'height':800})
        d=await mkpage(ctx2,'desk'); await d.goto(BASE); await d.click('[data-a="go"][data-to="local"]')
        for n in ['A','B','C']:
            await d.fill('#lname',n); await d.click('[data-a="ladd"]')
        await d.click('[data-a="start"]'); await asyncio.sleep(1)
        await d.screenshot(path='/tmp/shots/26_desktop.png')
        await b.close()
asyncio.run(main())
