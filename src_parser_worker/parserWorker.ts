import { getParsed, lexString } from "parser";

let channel: any = null;

onmessage = function (e) {
  if (e.data === "channel") {
    console.log("x");
    channel = e.ports[0];
    return;
  }

  let r = e.data.split(/;\n/);
  if (r.length === 1) {
    r = e.data.split(/;\r/);
  }
  for (let i = 0; i < r.length; i++) {
    if (r[i]) {
      lexString(r[i]);
    }
  }


  channel.postMessage(getParsed());
};

/* var channel = new MessageChannel();
channel.port1.postMessage('cool1')
channel.port2.postMessage('cool2') */
