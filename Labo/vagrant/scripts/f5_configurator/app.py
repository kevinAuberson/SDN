from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)

# Configuration for F5 AS3 API
BIGIP_HOST = "https://192.168.10.20"  # Replace with the correct F5 management IP
BIGIP_USER = "admin"
BIGIP_PASS = "*SJiu2"
AS3_ENDPOINT = f"{BIGIP_HOST}/mgmt/shared/appsvcs/declare"

# Route pour afficher le formulaire
@app.route('/')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def deploy():
    data = request.form
    vip = data.get("vip")
    members = data.get("members").split(',')
    cert = data.get("cert")
    key = data.get("key")

    # Simplified AS3 declaration
    declaration = {
        "class": "AS3",
        "declaration": {
            "class": "ADC",
            "schemaVersion": "3.49.0",
            "id": "example-declaration",
            "tenant": {
                "class": "Tenant",
                "application": {
                    "class": "Application",
                    "template": "generic",
                    "service": {
                        "class": "Service_HTTPS",
                        "virtualAddresses": [vip],
                        "virtualPort": 443,
                        "pool": "web_pool",
                        "snat": "none",
                        "serverTLS": "web_tls"
                    },
                    "web_pool": {
                        "class": "Pool",
                        "members": [{"servicePort": 80, "serverAddresses": members}],
                        "monitors": ["http"]
                    },
                    "web_tls": {
                        "class": "TLS_Server",
                        "certificates": [{
                            "certificate": "web_cert"
                        }]
                    },
                    "web_cert": {
                        "class": "Certificate",
                        "certificate": cert,
                        "privateKey": key
                    }
                }
            }
        }
    }

    # Send the declaration to the F5 API
    try:
        response = requests.post(
            AS3_ENDPOINT,
            auth=(BIGIP_USER, BIGIP_PASS),
            headers={"Content-Type": "application/json"},
            json=declaration,
            verify=False
        )
        return jsonify({
            "status_code": response.status_code,
            "response": response.text
        })
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
