ForVis
Wymagania wstępne:
Zainstalowany Docker oraz Docker Compose

Instrukcja instalacji Docker na Ubuntu 16.04: DigitalOcean Tutorial: https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04

Instalacja Docker Compose:
    sudo apt install docker-compose

Instalacja Node.js i npm:
    sudo apt install nodejs
    sudo apt install npm

Wyłączenie serwera Apache, jeśli działa:
    sudo pkill apache
Instrukcja uruchomienia systemu:
Budowanie plików frontendowych: Z katalogu frontend/formulavis wykonaj:
    npm install
    npm run build

Uruchomienie systemu z folderu z plikiem docker-compose.yml:
Standardowe uruchomienie:
    docker-compose up
Jeśli wymagane są uprawnienia administratora:
    sudo docker-compose up
    
Uniknięcie błędów z plikami: Wykonaj poniższą komendę:
    sudo chmod 777 _files

Rozwiązywanie problemów:

1. Błąd "Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock":
Ustaw odpowiednie uprawnienia:
    sudo chmod 666 /var/run/docker.sock

2. Błąd związany z działającymi serwisami (np. nginx, postgres):
Wyłącz działające serwisy:
    sudo service nginx stop
    sudo service postgres stop

3. Błąd "version in ... unsupported":
W pliku docker-compose.yml zmień wersję z 3 na 2.

4. Błąd związany z usługą nginx lub frontendem:
Postępuj zgodnie z poniższymi krokami:
Zatrzymaj system:
CTRL + C lub docker-compose stop
W sekcji frontend pliku docker-compose.yml dodaj opcję:
    command: npm install --no-optional
Uruchom system ponownie:
    docker-compose up
Po ponownym wystąpieniu błędu frontend, zatrzymaj system:
    docker-compose stop
Usuń wcześniej dodaną opcję w sekcji frontend w pliku docker-compose.yml.
Uruchom system ponownie:
    docker-compose up

Dane administratora:
    Login: admin
    Hasło: admin
Dostęp do systemu:
Strona główna projektu: Wpisz w przeglądarce:
    localhost
Panel administratora: Wpisz w przeglądarce:
    localhost:8000/admin/

Uwagi dodatkowe:
System może wymagać kilku sekund na pełne uruchomienie.
Powyższe instrukcje są zoptymalizowane dla Ubuntu 16.04, ale mogą działać również na nowszych wersjach systemu.