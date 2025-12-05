#!/usr/bin/env python3
import ssl
import socket
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import ipaddress
import datetime

def create_ssl_certificate():
    """Create a self-signed SSL certificate for localhost"""
    # Generate private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )

    # Create certificate subject
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COUNTRY_NAME, "CN"),
        x509.NameAttribute(NameOID.STATE_OR_PROVINCE_NAME, "Beijing"),
        x509.NameAttribute(NameOID.LOCALITY_NAME, "Beijing"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Development"),
        x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
    ])

    # Build certificate
    cert = x509.CertificateBuilder().subject_name(
        subject
    ).issuer_name(
        issuer
    ).public_key(
        private_key.public_key()
    ).serial_number(
        x509.random_serial_number()
    ).not_valid_before(
        datetime.datetime.utcnow()
    ).not_valid_after(
        datetime.datetime.utcnow() + datetime.timedelta(days=365)
    ).add_extension(
        x509.SubjectAlternativeName([
            x509.DNSName("localhost"),
            x509.DNSName("*.localhost"),
            x509.IPAddress(ipaddress.IPv4Address("127.0.0.1")),
            x509.IPAddress(ipaddress.IPv6Address("::1")),
        ]),
        critical=False,
    ).sign(private_key, hashes.SHA256())

    # Write certificate to file
    with open("localhost.crt", "wb") as f:
        f.write(cert.public_bytes(serialization.Encoding.PEM))

    # Write private key to file
    with open("localhost.key", "wb") as f:
        f.write(private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ))

    print("SSL certificate created successfully!")
    print("Certificate: localhost.crt")
    print("Private key: localhost.key")
    print("Valid for 365 days")
    print("Covers: localhost, *.localhost, 127.0.0.1, ::1")

if __name__ == "__main__":
    create_ssl_certificate()