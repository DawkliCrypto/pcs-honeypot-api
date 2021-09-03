# PancakeSwap Honeypot API
Simple honeypot API to be called by other apps. Set the BscHttpApi value in ".env.sample" and rename it to ".env".

`docker-compose up -d` to build and run
`docker logs -f pcshoneypotapi` to view logs

Pass the contract address to http://127.0.0.1:3000/api/contract/ for results. 

E.g. http://127.0.0.1:3000/api/contract/0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3
