#!/bin/bash

echo "=========================================="
echo "   Local Network Access Information"
echo "=========================================="
echo ""

# Get local IP addresses
echo "Your local IP addresses:"
echo "------------------------"

# Try different methods to get IP
if command -v ip &> /dev/null; then
    ip route get 1.1.1.1 | grep -oP 'src \K\S+' 2>/dev/null || echo "Could not detect with 'ip' command"
elif command -v hostname &> /dev/null; then
    hostname -I 2>/dev/null | awk '{print $1}' || echo "Could not detect with 'hostname' command"
fi

# Alternative method
if command -v ifconfig &> /dev/null; then
    ifconfig | grep -E 'inet (192\.168\.|10\.0\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.)' | awk '{print $2}' | head -1
fi

echo ""
echo "Access your app from other devices:"
echo "-----------------------------------"
echo "Local computer:      http://localhost:8080"
echo "Same network:        http://[YOUR_IP]:8080"
echo ""
echo "Example URLs for other devices:"
if command -v hostname &> /dev/null; then
    LOCAL_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
    if [ ! -z "$LOCAL_IP" ]; then
        echo "                     http://$LOCAL_IP:8080"
    fi
fi
echo ""
echo "Auth/Admin pages:"
echo "Local:               http://localhost:8080/auth"
echo "Network:             http://[YOUR_IP]:8080/auth"
echo ""
echo "Notes:"
echo "- Make sure your firewall allows connections on port 8080"
echo "- Both devices must be on the same network"
echo "- Update Supabase redirect URLs if authentication doesn't work"
echo "=========================================="