'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, Button, Input, Badge, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { CheckCircle2, XCircle, AlertCircle, Camera, Zap } from 'lucide-react';

interface CheckInRecord {
  ticketId: string;
  userName: string;
  eventTitle: string;
  checkedInAt: string;
  status: 'success' | 'error' | 'duplicate';
}

export default function CheckInPage() {
  const [records, setRecords] = useState<CheckInRecord[]>([]);
  const [qrData, setQrData] = useState('');
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRecord, setSelectedRecord] = useState<CheckInRecord | null>(null);

  useEffect(() => {
    // Focus input on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const parseQRCode = (data: string) => {
    // Format: TICKET|{ticketId}|{userName}|{eventTitle}
    const parts = data.split('|');
    if (parts[0] === 'TICKET' && parts.length === 4) {
      return {
        ticketId: parts[1],
        userName: parts[2],
        eventTitle: parts[3],
      };
    }
    return null;
  };

  const handleQRScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const data = qrData.trim();
      if (!data) return;

      const parsed = parseQRCode(data);
      
      if (!parsed) {
        const record: CheckInRecord = {
          ticketId: 'INVALID',
          userName: 'Invalid QR Code',
          eventTitle: 'Unknown',
          checkedInAt: new Date().toLocaleTimeString(),
          status: 'error',
        };
        setRecords([record, ...records]);
        setQrData('');
        inputRef.current?.focus();
        return;
      }

      // Check for duplicates
      const isDuplicate = records.some(
        r => r.ticketId === parsed.ticketId && r.status === 'success'
      );

      if (isDuplicate) {
        const record: CheckInRecord = {
          ...parsed,
          checkedInAt: new Date().toLocaleTimeString(),
          status: 'duplicate',
        };
        setRecords([record, ...records]);
        setDuplicateCount(duplicateCount + 1);
      } else {
        const record: CheckInRecord = {
          ...parsed,
          checkedInAt: new Date().toLocaleTimeString(),
          status: 'success',
        };
        setRecords([record, ...records]);
        setCheckedInCount(checkedInCount + 1);
      }

      setQrData('');
      inputRef.current?.focus();
    }
  };

  const handleViewRecord = (record: CheckInRecord) => {
    setSelectedRecord(record);
    onOpen();
  };

  const resetStats = () => {
    setRecords([]);
    setCheckedInCount(0);
    setDuplicateCount(0);
    setQrData('');
    inputRef.current?.focus();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'duplicate':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-danger" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-default-50 to-default-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Event Check-In</h1>
          </div>
          <p className="text-default-600">Scan attendee QR codes to mark them as checked-in</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-default-600 text-sm">Checked In</p>
                  <p className="text-4xl font-bold text-success">{checkedInCount}</p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-success/30" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-default-600 text-sm">Duplicates</p>
                  <p className="text-4xl font-bold text-warning">{duplicateCount}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-warning/30" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-default-600 text-sm">Total Scans</p>
                  <p className="text-4xl font-bold text-primary">{records.length}</p>
                </div>
                <Camera className="w-12 h-12 text-primary/30" />
              </div>
            </div>
          </Card>
        </div>

        {/* Input Section */}
        <Card className="mb-8 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="p-6">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Scan QR Code
            </label>
            <Input
              ref={inputRef}
              placeholder="Point camera at QR code and press Enter..."
              value={qrData}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQrData(e.target.value)}
              onKeyDown={handleQRScan}
              size="lg"
              startContent={<Camera className="w-5 h-5 text-default-400" />}
              variant="bordered"
              className="font-mono"
            />
            <p className="text-xs text-default-500 mt-2">
              Works with external QR scanner or mobile camera apps
            </p>
          </div>
        </Card>

        <Divider className="my-8" />

        {/* Records List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Check-In History</h2>
            {records.length > 0 && (
              <Button
                isIconOnly
                variant="light"
                color="danger"
                size="sm"
                onPress={resetStats}
              >
                Clear All
              </Button>
            )}
          </div>

          {records.length === 0 ? (
            <Card className="bg-default-50 border-dashed border-2">
              <div className="p-12 text-center">
                <Camera className="w-12 h-12 text-default-300 mx-auto mb-4" />
                <p className="text-default-500">No scans yet. Start scanning QR codes!</p>
              </div>
            </Card>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {records.map((record, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:bg-default-100 transition-colors"
                  onPress={() => handleViewRecord(record)}
                >
                  <div className="p-4 flex items-center gap-4">
                    <div>{getStatusIcon(record.status)}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{record.userName}</p>
                      <p className="text-sm text-default-600">{record.eventTitle}</p>
                      <p className="text-xs text-default-500">{record.ticketId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-default-600">{record.checkedInAt}</p>
                      <Badge
                        color={
                          record.status === 'success'
                            ? 'success'
                            : record.status === 'duplicate'
                            ? 'warning'
                            : 'danger'
                        }
                        variant="flat"
                        size="sm"
                      >
                        {record.status === 'success'
                          ? 'Checked In'
                          : record.status === 'duplicate'
                          ? 'Duplicate'
                          : 'Invalid'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Check-In Details</ModalHeader>
          <ModalBody>
            {selectedRecord && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-default-600">Attendee Name</p>
                  <p className="font-semibold text-foreground">{selectedRecord.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-default-600">Event</p>
                  <p className="font-semibold text-foreground">{selectedRecord.eventTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-default-600">Ticket ID</p>
                  <p className="font-mono text-sm text-default-500 break-all">{selectedRecord.ticketId}</p>
                </div>
                <div>
                  <p className="text-sm text-default-600">Check-In Time</p>
                  <p className="font-semibold text-foreground">{selectedRecord.checkedInAt}</p>
                </div>
                <div>
                  <p className="text-sm text-default-600">Status</p>
                  <Badge
                    color={
                      selectedRecord.status === 'success'
                        ? 'success'
                        : selectedRecord.status === 'duplicate'
                        ? 'warning'
                        : 'danger'
                    }
                    variant="flat"
                  >
                    {selectedRecord.status === 'success'
                      ? 'Successfully Checked In'
                      : selectedRecord.status === 'duplicate'
                      ? 'Duplicate Entry'
                      : 'Invalid QR Code'}
                  </Badge>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
