import http from 'http'
import os from 'os'

const servidor = http.createServer((req, res) => {
    if (req.url == '/cpu') {

        // response
        const info = {
            "Núcleos": `${os.cpus().length}`,
            "Modelo CPU": `${os.cpus()[0].model}`,
            "Velocidade CPU": `${os.cpus()[0].speed}`,
        }

        // definição do conteudo
        res.writeHead(200, {"Content-Type":"application/json"})
        return res.end(JSON.stringify(info, null, 2))
    }

    else if (req.url == "/memoria") {

        // converte em gigabytes para melhor visualização
        let memoriaLivreGB = os.freemem() / (1024 * 1024 * 1024)
        let memoriaTotalGB = os.totalmem() / (1024 * 1024 * 1024)
        let percentualUso = ((os.totalmem - os.freemem) / os.totalmem) * 100
        
        // response
        const info = {
            'Memória livre': `${Number(memoriaLivreGB.toFixed(2))}gb`,
            'Memória total': `${Number(memoriaTotalGB.toFixed(2))}gb`,
            'Percentual de uso': `${Number(percentualUso.toFixed(2))}%`
        }

        res.writeHead(200, {"Content-Type":"application/json"})
        return res.end(JSON.stringify(info, null, 2))

    }
    else if (req.url == "/status") {

        // resumo cpu, memoria e uptime
        let cpuResumido = [os.cpus()[0].model, `${os.cpus()[0].speed}MHz`] 
        let memoriaLivreGB = os.freemem() / (1024 * 1024 * 1024)
        let memoriaTotalGB = os.totalmem() / (1024 * 1024 * 1024)
        let memoriaEmUso = memoriaTotalGB - memoriaLivreGB
        let memoriaResumida = [`Memória livre: ${Number(memoriaLivreGB.toFixed(2))}gb`, `Memória total: ${Number(memoriaTotalGB.toFixed(2))}gb`, `Memória em uso: ${Number(memoriaEmUso.toFixed(2))}gb`]
        let upTimeTempo = [`Segundos: ${(os.uptime()).toFixed(0)}, Horas: ${(os.uptime() / 3600).toFixed(0)}`]
        
        // response
        const info = {
            'Plataforma': `${os.platform}`,
            'Arquitetura': `${os.arch}`,
            'Tempo ligado': `${upTimeTempo}`,
            'Diretório home': `${os.homedir}`,
            'Diretório temporário': `${os.tmpdir}`,
            'CPU': `${cpuResumido}`,
            'Memória': `${memoriaResumida}`
        }

        res.writeHead(200, {'Content-Type':'application/json'})
        return res.end(JSON.stringify(info, null, 2))

    }
    else {
        // página inicial
        res.writeHead(200, {"Content-Type":"text/html"})
        res.end("<h1>Monitor do Sistema</h1> <ul> <li><a href='/cpu'>Informacoes da cpu</li> <li><a href='/memoria'>Memoria do sistema</li> <li><a href='/status'>Status completo</li> </ul> ")
    }
})

servidor.listen(3004, () => {
    console.log('Servidor web ativo')
})
