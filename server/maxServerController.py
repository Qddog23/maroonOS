import subprocess

def startServers():
    ports = [8001, 8002, 8003]

    processes = []

    for port in ports:
        process = subprocess.Popen(['python3', 'server.py', str(port)])
        processes.append(process)

    for process in processes:
        process.wait()

if __name__ == '__main__':
    startServers()