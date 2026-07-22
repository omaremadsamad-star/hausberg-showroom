<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BackupService
{
    public function generateBackup(): string
    {
        $pdo = DB::connection()->getPdo();
        $tables = [];
        $result = $pdo->query('SHOW TABLES');
        
        while ($row = $result->fetch(\PDO::FETCH_NUM)) {
            $tables[] = $row[0];
        }

        $sql = "-- Hausberg Showroom Database Backup\n";
        $sql .= "-- Generated at: " . now()->toDateTimeString() . "\n\n";
        $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

        foreach ($tables as $table) {
            if ($table === 'sessions' || $table === 'login_attempts') {
                continue;
            }

            // Create Table syntax
            $res = $pdo->query("SHOW CREATE TABLE `{$table}`");
            $row = $res->fetch(\PDO::FETCH_ASSOC);
            
            $sql .= "DROP TABLE IF EXISTS `{$table}`;\n";
            $sql .= $row['Create Table'] . ";\n\n";

            // Insert statements
            $resData = $pdo->query("SELECT * FROM `{$table}`");
            while ($rowData = $resData->fetch(\PDO::FETCH_ASSOC)) {
                $columns = array_map(function($col) {
                    return "`{$col}`";
                }, array_keys($rowData));

                $values = array_map(function($val) use ($pdo) {
                    if ($val === null) {
                        return 'NULL';
                    }
                    return $pdo->quote($val);
                }, array_values($rowData));

                $sql .= "INSERT INTO `{$table}` (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $values) . ");\n";
            }
            $sql .= "\n";
        }

        $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

        $filename = 'backup_' . now()->format('Ymd_His') . '.sql';
        
        // Ensure backups directory exists
        if (!Storage::disk('local')->exists('backups')) {
            Storage::disk('local')->makeDirectory('backups');
        }
        
        Storage::disk('local')->put('backups/' . $filename, $sql);

        return $filename;
    }

    public function restoreBackup(string $sqlContent): void
    {
        $pdo = DB::connection()->getPdo();
        
        $pdo->exec('SET FOREIGN_KEY_CHECKS=0;');

        // Split queries by semicolon outside quotes
        $queries = preg_split("/;+(?=(?:[^'\"]*['\"][^'\"]*['\"])*[^'\"]*$)/", $sqlContent);

        foreach ($queries as $query) {
            $query = trim($query);
            if (!empty($query)) {
                $pdo->exec($query);
            }
        }

        $pdo->exec('SET FOREIGN_KEY_CHECKS=1;');
    }
}
