'use strict';

const { spawn } = require('child_process');

function command(cmd, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args);

    proc.stdout.setEncoding('utf-8');
    proc.stderr.setEncoding('utf8');

    proc.stdout.on('data', (data) => {
      console.log(data);
    });

    proc.stderr.on('data', (data) => {
      console.log(data);
    });

    proc.on('close', () => {
      resolve();
    });
  });
}

const clips = [
  "https://www.youtube.com/watch?v=X4p_oCFLdJE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=2&t=0s",
  "https://www.youtube.com/watch?v=mZxenUmWsac&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=3&t=0s",
  "https://www.youtube.com/watch?v=rq3n2sJ43Hg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=4&t=0s",
  "https://www.youtube.com/watch?v=OqkHPsY8p84&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=5&t=0s",
  "https://www.youtube.com/watch?v=E1JvNlSfiD0&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=6&t=0s",
  "https://www.youtube.com/watch?v=5y4b-DEkIps&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=7&t=0s",
  "https://www.youtube.com/watch?v=3Ajh8zKPMXc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=8&t=0s",
  "https://www.youtube.com/watch?v=quZU_hA4Pr4&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=9&t=0s",
  "https://www.youtube.com/watch?v=OsAd4HGJS4o&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=10&t=0s",
  "https://www.youtube.com/watch?v=szzVlQ653as&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=11&t=0s",
  "https://www.youtube.com/watch?v=7ecYoSvGO60&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=12&t=0s",
  "https://www.youtube.com/watch?v=up4i3sMBl94&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=13&t=1s",
  "https://www.youtube.com/watch?v=EF98G8lWZeA&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=14&t=5s",
  "https://www.youtube.com/watch?v=DhhZqKlO6wE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=15&t=0s",
  "https://www.youtube.com/watch?v=oO3wTulizvg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=16&t=0s",
  "https://www.youtube.com/watch?v=NHSKnxU2ldw&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=17&t=0s",
  "https://www.youtube.com/watch?v=AAvLC3fz068&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=18&t=1213s",
  "https://www.youtube.com/watch?v=A48AJ_5nWsc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=19&t=1s",
  "https://www.youtube.com/watch?v=Plr81gaUIr0&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=20&t=435s",
  "https://www.youtube.com/watch?v=KVKEifWrwn4&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=21&t=0s",
  "https://www.youtube.com/watch?v=LuzGs8SfXBo&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=22&t=0s",
  "https://www.youtube.com/watch?v=eMJk4y9NGvE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=23&t=0s",
  "https://www.youtube.com/watch?v=T5ei9nEWfyU&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=24&t=0s",
  "https://www.youtube.com/watch?v=luK3GNF8c6E&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=25&t=0s",
  "https://www.youtube.com/watch?v=92Y0bAXv9hM&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=26&t=0s",
  "https://www.youtube.com/watch?v=cPRf3K90lKg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=27&t=3s",
  "https://www.youtube.com/watch?v=ab1H602yc_Y&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=28&t=849s",
  "https://www.youtube.com/watch?v=uc6f_2nPSX8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=29&t=0s",
  "https://www.youtube.com/watch?v=4dwjS_eI-lQ&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=30&t=0s",
  "https://www.youtube.com/watch?v=aiqKK4ysI7g&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=31&t=0s",
  "https://www.youtube.com/watch?v=YLWjn0TFH3U&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=32&t=0s",
  "https://www.youtube.com/watch?v=Zo62S0ulqhA&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=33&t=0s",
  "https://www.youtube.com/watch?v=IRVdiHu1VCc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=34&t=0s",
  "https://www.youtube.com/watch?v=H02YcexnEqc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=35&t=0s",
  "https://www.youtube.com/watch?v=xYemnKEKx0c&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=36&t=0s",
  "https://www.youtube.com/watch?v=1xSHEb8xM80&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=37&t=3s",
  "https://www.youtube.com/watch?v=fQSUGMtDCtk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=38&t=5s",
  "https://www.youtube.com/watch?v=lt_Fmr7pkak&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=39&t=7s",
  "https://www.youtube.com/watch?v=H5yvhP-9mik&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=40&t=5s",
  "https://www.youtube.com/watch?v=qYbm096uzEc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=41&t=0s",
  "https://www.youtube.com/watch?v=hqKafI7Amd8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=42&t=1s",
  "https://www.youtube.com/watch?v=FZj97aPZZFU&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=43&t=274s",
  "https://www.youtube.com/watch?v=sR6UeVptzRg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=44&t=0s",
  "https://www.youtube.com/watch?v=kTzmVgGG5Bw&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=45&t=0s",
  "https://www.youtube.com/watch?v=KNAgFhh1ji4&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=46&t=0s",
  "https://www.youtube.com/watch?v=3RDVwPRFv38&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=47&t=0s",
  "https://www.youtube.com/watch?v=1MBjJMMKASQ&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=48&t=1s",
  "https://www.youtube.com/watch?v=gHlWCfMhOgc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=49&t=0s",
  "https://www.youtube.com/watch?v=frHzCQeB2Kg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=50&t=0s",
  "https://www.youtube.com/watch?v=4aGWkc_IDuk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=51&t=0s",
  "https://www.youtube.com/watch?v=BLNDqxrUUwQ&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=52&t=1s",
  "https://www.youtube.com/watch?v=MvZ-clcMCec&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=53&t=8s",
  "https://www.youtube.com/watch?v=EV2TFPBo2Nw&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=54&t=0s",
  "https://www.youtube.com/watch?v=NS4UT_t73b0&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=55&t=192s",
  "https://www.youtube.com/watch?v=UGarvJPTOAY&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=56&t=0s",
  "https://www.youtube.com/watch?v=pfwReaULI9M&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=57&t=0s",
  "https://www.youtube.com/watch?v=RlVlY6QAKpc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=58&t=0s",
  "https://www.youtube.com/watch?v=hHW1oY26kxQ&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=59&t=0s",
  "https://www.youtube.com/watch?v=pdmODVYPDLA&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=60&t=954s",
  "https://www.youtube.com/watch?v=aagyuWlHyUI&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=61&t=0s",
  "https://www.youtube.com/watch?v=DhnBn_c9f8Q&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=62&t=0s",
  "https://www.youtube.com/watch?v=tixOyiR8B-8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=63&t=0s",
  "https://www.youtube.com/watch?v=of-F44HGa2k&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=64&t=0s",
  "https://www.youtube.com/watch?v=bbsPgw13hJY&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=65&t=10s",
  "https://www.youtube.com/watch?v=_fVjJmX2GYs&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=66&t=0s",
  "https://www.youtube.com/watch?v=xDAsABdkWSc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=67&t=0s",
  "https://www.youtube.com/watch?v=v6yg4ImnYwA&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=68&t=0s",
  "https://www.youtube.com/watch?v=hdQcGzbpN7s&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=69&t=0s",
  "https://www.youtube.com/watch?v=4QrvLoxFAM4&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=70&t=0s",
  "https://www.youtube.com/watch?v=j7Pj_5Qqjkc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=71",
  "https://www.youtube.com/watch?v=PmsxwfTlohU&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=72&t=197s",
  "https://www.youtube.com/watch?v=H6ZFzEW7_Q4&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=73&t=0s",
  "https://www.youtube.com/watch?v=EuFfmnu34rs&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=74&t=0s",
  "https://www.youtube.com/watch?v=FCuvdv8FO54&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=75&t=9s",
  "https://www.youtube.com/watch?v=VHaGh7eEQOY&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=76&t=0s",
  "https://www.youtube.com/watch?v=PNs68O5JSKg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=77&t=1606s",
  "https://www.youtube.com/watch?v=F4J9-CQXdPk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=78&t=122s",
  "https://www.youtube.com/watch?v=ciC5QsEeAAc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=79&t=0s",
  "https://www.youtube.com/watch?v=2DFYvwn_xLM&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=80&t=0s",
  "https://www.youtube.com/watch?v=IorDYGI1uqc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=81&t=0s",
  "https://www.youtube.com/watch?v=D6uEGtGg3Jk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=82&t=0s",
  "https://www.youtube.com/watch?v=61TMtH3Qw4s&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=83&t=0s",
  "https://www.youtube.com/watch?v=nPkannJ4Hpw&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=84&t=0s",
  "https://www.youtube.com/watch?v=YnZp1jtOhR0&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=85&t=12s",
  "https://www.youtube.com/watch?v=Cy6I9ydBSWc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=86&t=0s",
  "https://www.youtube.com/watch?v=tLMzEOoSjc4&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=87&t=0s",
  "https://www.youtube.com/watch?v=L7I2WyFgLkA&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=88&t=0s",
  "https://www.youtube.com/watch?v=_qyBEvJG01A&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=89&t=581s",
  "https://www.youtube.com/watch?v=csTkMwBE45g&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=90&t=0s",
  "https://www.youtube.com/watch?v=LeFxjRMv5U8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=91&t=0s",
  "https://www.youtube.com/watch?v=KFzqike1Z0A&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=92&t=0s",
  "https://www.youtube.com/watch?v=lP_9aWr4pJU&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=93&t=0s",
  "https://www.youtube.com/watch?v=0zDo7hkmCNY&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=94&t=1s",
  "https://www.youtube.com/watch?v=spOWFb7zfOo&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=95&t=0s",
  "https://www.youtube.com/watch?v=-9-6259glPE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=96&t=1700s",
  "https://www.youtube.com/watch?v=75aVWopsbPE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=97&t=0s",
  "https://www.youtube.com/watch?v=vL-UE7Et9OM&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=98&t=92s",
  "https://www.youtube.com/watch?v=-Tq_v0lbLpc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=99&t=0s",
  "https://www.youtube.com/watch?v=Dmyi7GRl4Hk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=100&t=0s",
  "https://www.youtube.com/watch?v=XgYZtNhAgaE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=101&t=0s",
  "https://www.youtube.com/watch?v=b2dehpRFyLA&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=102&t=0s",
  "https://www.youtube.com/watch?v=zeKqD2g9-ic&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=103",
  "https://www.youtube.com/watch?v=BkmE8SQ8V0k&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=104&t=0s",
  "https://www.youtube.com/watch?v=1e1iiUIZxQk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=105&t=3s",
  "https://www.youtube.com/watch?v=Hhy7JUinlu0&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=106&t=5s",
  "https://www.youtube.com/watch?v=NlpxjBgG-7E&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=107&t=5s",
  "https://www.youtube.com/watch?v=wfbqJpn8fN8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=108&t=0s",
  "https://www.youtube.com/watch?v=0ds0wYpc1eM&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=109&t=0s",
  "https://www.youtube.com/watch?v=5Z0wEVxL30Q&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=110&t=32s",
  "https://www.youtube.com/watch?v=5tevpQpsf0M&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=111&t=0s",
  "https://www.youtube.com/watch?v=IBJbqV3IROM&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=112&t=0s",
  "https://www.youtube.com/watch?v=3c80R0HDtnE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=113&t=32s",
  "https://www.youtube.com/watch?v=Hdmi1UbW4Yk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=114&t=0s",
  "https://www.youtube.com/watch?v=Tid44iy6Rjs&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=115&t=0s",
  "https://www.youtube.com/watch?v=XLMDSjCzEx8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=116&t=1s",
  "https://www.youtube.com/watch?v=VDeZyRtPJvI&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=117&t=0s",
  "https://www.youtube.com/watch?v=C3J1AO9z0tA&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=118&t=4s",
  "https://www.youtube.com/watch?v=4rT5fYMfEUc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=119&t=0s",
  "https://www.youtube.com/watch?v=LBBni_-tMNs&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=120&t=0s",
  "https://www.youtube.com/watch?v=5NP8y63Ms4o&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=121&t=6s",
  "https://www.youtube.com/watch?v=wlcuPNv8Od8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=122&t=3s",
  "https://www.youtube.com/watch?v=Y6YBKdmOlM8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=123&t=0s",
  "https://www.youtube.com/watch?v=OMDQzITWJyU&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=124&t=0s",
  "https://www.youtube.com/watch?v=qctO1duelq8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=125&t=0s",
  "https://www.youtube.com/watch?v=nM97UfizOn8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=126&t=4s",
  "https://www.youtube.com/watch?v=zt8qoggxWVg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=127&t=4s",
  "https://www.youtube.com/watch?v=elrnAl6ygeM&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=128&t=16s",
  "https://www.youtube.com/watch?v=DIlG9aSMCpg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=129&t=0s",
  "https://www.youtube.com/watch?v=RW1qHA5Hqwc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=130&t=4s",
  "https://www.youtube.com/watch?v=V_Vu8bTPtgY&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=131&t=4s",
  "https://www.youtube.com/watch?v=K7l5ZeVVoCA&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=132&t=0s",
  "https://www.youtube.com/watch?v=y0brSA1cyzw&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=133&t=0s",
  "https://www.youtube.com/watch?v=96AO6L9qp2U&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=134&t=0s",
  "https://www.youtube.com/watch?v=s1tAYmMjLdY&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=135&t=0s",
  "https://www.youtube.com/watch?v=krpm0v_486k&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=136&t=0s",
  "https://www.youtube.com/watch?v=ut7gABosyzU&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=137&t=197s",
  "https://www.youtube.com/watch?v=3NlWTk7azn4&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=138&t=164s",
  "https://www.youtube.com/watch?v=A25EUhZGBws&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=139&t=20s",
  "https://www.youtube.com/watch?v=xbiDrzTd8fE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=140&t=245s",
  "https://www.youtube.com/watch?v=QQ0Yn1fqugg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=141&t=0s",
  "https://www.youtube.com/watch?v=de2grEPn7rg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=142&t=9s",
  "https://www.youtube.com/watch?v=rA64dwSFzic&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=143&t=0s",
  "https://www.youtube.com/watch?v=-oF0XYRhRvA&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=144&t=8s",
  "https://www.youtube.com/watch?v=gbUKg_kd44s&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=145&t=0s",
  "https://www.youtube.com/watch?v=Hzk1bM2vVFU&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=146&t=0s",
  "https://www.youtube.com/watch?v=mbnBYh-BJ1g&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=147&t=5s",
  "https://www.youtube.com/watch?v=N1fVL4AQEW8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=148&t=4s",
  "https://www.youtube.com/watch?v=nGHP4uGImX4&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=149&t=5s",
  "https://www.youtube.com/watch?v=X7iRe8O8Jsk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=150&t=4s",
  "https://www.youtube.com/watch?v=ZPHSXUS0_1c&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=151&t=3s",
  "https://www.youtube.com/watch?v=gxTRCPKFltE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=152&t=4s",
  "https://www.youtube.com/watch?v=vVy9Lgpg1m8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=153&t=0s",
  "https://www.youtube.com/watch?v=6tYnAf7PqV0&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=154&t=4s",
  "https://www.youtube.com/watch?v=oSjVv76H360&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=155&t=4s",
  "https://www.youtube.com/watch?v=OQUaguZawJQ&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=156&t=0s",
  "https://www.youtube.com/watch?v=1PqzGSg3Y74&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=157&t=9s",
  "https://www.youtube.com/watch?v=M0xj2GIP9t4&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=158&t=161s",
  "https://www.youtube.com/watch?v=aa22MBGkl9o&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=159&t=0s",
  "https://www.youtube.com/watch?v=BK93l9f5D5s&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=160&t=2s",
  "https://www.youtube.com/watch?v=66kd4fWo4YQ&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=161&t=1s",
  "https://www.youtube.com/watch?v=WCcLMNcWZOc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=162&t=1s",
  "https://www.youtube.com/watch?v=ARJ8cAGm6JE&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=163&t=7s",
  "https://www.youtube.com/watch?v=MuOvqeABHvQ&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=164&t=0s",
  "https://www.youtube.com/watch?v=DY-GgzZKxUQ&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=165&t=7s",
  "https://www.youtube.com/watch?v=yHqdESArkqU&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=166&t=0s",
  "https://www.youtube.com/watch?v=ufOC6fq3fPg&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=167&t=1s",
  "https://www.youtube.com/watch?v=Fz4F2X1xSc8&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=168&t=1s",
  "https://www.youtube.com/watch?v=ur0z7isXkhc&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=169&t=1s",
  "https://www.youtube.com/watch?v=g5ciBWNwjsY&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=170&t=0s",
  "https://www.youtube.com/watch?v=KWPhV6PUr9o&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=171&t=3s",
  "https://www.youtube.com/watch?v=9FnO3igOkOk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=172&t=0s",
  "https://www.youtube.com/watch?v=-eREiQhBDIk&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=173&t=0s",
  "https://www.youtube.com/watch?v=_-d1S79zt8c&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=174&t=0s",
  "https://www.youtube.com/watch?v=_b39cJVj89I&list=PLSYpXKZGuzgt0uXek01P9W9U1OUWzuzkI&index=175&t=10s"
];

async function download() {
  try {
    for (let url of clips) {
      console.log('Downloading', url);
      await command('youtube-dl', [
        url
      ]);
    }
  }
  catch (error) {
    console.error('downloader error', error);
  }
}

download();