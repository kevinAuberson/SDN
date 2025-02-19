## Template et configuration d'ADC F5 avec l'API AS3

Student: **[kevin.auberson@heig-vd.ch]()**

[Project documentation](./docs)

Configuration d'un F5 ADC (Load-Balancer, Reverse-Proxy, etc…) avec l'API AS3.



## 1 Activités

AS3, Application Services 3 Extension, est un API avec un model déclaratif pour configurer en une fois (un JSON) plusieurs éléments différents du F5 BigIP.

L'étudiant doit fournir une interface graphique et un script Python en ligne de commande pour configurer les élément suivants pour un reverse-proxy HTTPS:

- Créer un virtual-server avec un VIP assignée
- Créer un pool pour le backend
- Ajoute les membres au pool
- Assigner une IP dédiée pour le source NAT (SNAT) 
- Configure le certificat, le monitoring et tous les paramètres avec un Template commun

Une démonstration/simulation est souhaitée, les serveurs de backend peuvent être simulés facilement avec des containers, S'inspirer des travaux précédents sur GitLab.




## 2 Inspirations et références

- https://itp-git01.heigadm.ch/network/f5/-/blob/main/auto-f5-0.2/src/create.ts?ref_type=heads
-	https://clouddocs.f5.com/products/extensions/f5-appsvcs-extension/latest/
-	https://git.iict.ch/sdnnfv19/sdn-f5-rest
-	https://git.iict.ch/sdnnfv23/sdn-k8s-f5cis3



## 3 Main technologies

F5 ADC, Python/flask, AS3 REST API



## Change Log
Version | Date | User | Change
------- | ---- | ---- | ------
1.0 | 20.09.2024 | @fabien.bruchez | Initial version

