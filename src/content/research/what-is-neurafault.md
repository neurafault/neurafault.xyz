---
title: "What is Neurafault"
description: "Independent AI security research lab. Offensive security, vulnerability research, open-source tooling."
pubDate: 2026-04-06
tags: [meta, manifesto]
severity: info
draft: false
---

## // INIT

Neurafault is an independent security research lab operating at the intersection of mathematics, programming, artificial intelligence, and offensive cybersecurity.

No corporate backing. No advisory board. No PR department. Just research.

## // SCOPE

The lab focuses on four areas:

- **Penetration testing** — targeting AI-integrated systems, APIs, and infrastructure where machine learning models sit in the attack path.
- **AI security research** — adversarial attacks, prompt injection, model extraction, training data poisoning, and everything the spec sheets don't cover.
- **Vulnerability research** — finding, documenting, and responsibly disclosing flaws in production systems. CVEs where applicable.
- **Open-source tooling** — building and releasing offensive and defensive tools for the security community.

## // THREAT MODEL

The attack surface of AI is expanding faster than the defenses around it.

Large language models are being deployed into authentication flows, financial systems, medical infrastructure, and military applications. Most of these deployments treat the model as a black box and the API as a trust boundary. Both assumptions are wrong.

Adversarial machine learning is not theoretical. Model inversion, membership inference, backdoor injection — these are documented, reproducible, and increasingly automated. The gap between published research and real-world exploitation is shrinking.

Most engineering teams are not equipped for this. The security tooling is immature. The threat models are incomplete. The audit processes assume static software, not probabilistic systems that change behavior based on input distribution.

This is the problem space Neurafault operates in.

## // OUTPUT

This site serves as the public-facing research output of the lab. Expect:

- **Technical writeups** — detailed breakdowns of vulnerabilities, attack chains, and novel techniques.
- **CVE analysis** — dissection of disclosed vulnerabilities in AI/ML systems and adjacent infrastructure.
- **Tool releases** — open-source offensive and defensive security tooling.
- **Case studies** — real-world engagements, anonymized where required.

No fluff. No engagement bait. Raw technical output.

## // OPERATOR

Neurafault is run by **Dima** ([@hyrahmo](https://hyrahmo.com)) — security researcher, mathematician, engineer.

## // EOF
