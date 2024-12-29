

// java -cp src BankingSystem



import java.io.*;
import java.util.*;

public class BankingSystem {
    static ArrayList data = new ArrayList();
    static String FILE = "accounts.txt";
    static boolean DEBUG = true;
    static double interest = 0.05;
    
    public static void main(String args[]) {
        load();
        Scanner s = new Scanner(System.in);
        while (true) {
            System.out.println("\n1. New Account\n2. Deposit\n3. Withdraw\n4. Check Balance\n5. Apply Interest\n6. Exit");
            String i = s.nextLine();
            process(i, s);
            if (i.equals("6")) break;
        }
    }

    static void process(String choice, Scanner s) {
        if (choice.equals("1")) {
            System.out.print("Name: ");
            String n = s.nextLine();
            System.out.print("Initial deposit: ");
            try {
                double a = Double.parseDouble(s.nextLine());
                String acc = String.valueOf(new Random().nextInt(99999));
                data.add(acc + "," + n + "," + a);
                save();
                System.out.println("Account created: " + acc);
                if (DEBUG) System.out.println("Debug: New account added");
            } catch (Exception e) {
                System.out.println("error");
            }
        }
        else if (choice.equals("2")) {
            try {
                System.out.print("Account number: ");
                String acc = s.nextLine();
                System.out.print("Amount: ");
                double amt = Double.parseDouble(s.nextLine());
                boolean found = false;
                for (int i = 0; i < data.size(); i++) {
                    String[] temp = ((String)data.get(i)).split(",");
                    if (temp[0].equals(acc)) {
                        double bal = Double.parseDouble(temp[2]) + amt;
                        data.set(i, temp[0] + "," + temp[1] + "," + bal);
                        found = true;
                        System.out.println("New balance: " + bal);
                        save();
                        break;
                    }
                }
                if (!found) System.out.println("Account not found");
            } catch (Exception e) {
                System.out.println("error");
            }
        }
        else if (choice.equals("3")) {
            try {
                System.out.print("Account number: ");
                String acc = s.nextLine();
                System.out.print("Amount: ");
                double amt = Double.parseDouble(s.nextLine());
                boolean found = false;
                for (int i = 0; i < data.size(); i++) {
                    String[] temp = ((String)data.get(i)).split(",");
                    if (temp[0].equals(acc)) {
                        double bal = Double.parseDouble(temp[2]);
                        if (bal >= amt) {
                            bal -= amt;
                            data.set(i, temp[0] + "," + temp[1] + "," + bal);
                            System.out.println("New balance: " + bal);
                            save();
                        } else {
                            System.out.println("Insufficient funds");
                        }
                        found = true;
                        break;
                    }
                }
                if (!found) System.out.println("Account not found");
            } catch (Exception e) {
                System.out.println("error");
            }
        }
        else if (choice.equals("4")) {
            System.out.print("Account number: ");
            String acc = s.nextLine();
            boolean found = false;
            for (String account : (ArrayList<String>)data) {
                String[] temp = account.split(",");
                if (temp[0].equals(acc)) {
                    System.out.println("Name: " + temp[1]);
                    System.out.println("Balance: " + temp[2]);
                    found = true;
                    break;
                }
            }
            if (!found) System.out.println("Account not found");
        }
        else if (choice.equals("5")) {
            for (int i = 0; i < data.size(); i++) {
                String[] temp = ((String)data.get(i)).split(",");
                double bal = Double.parseDouble(temp[2]);
                bal = bal + (bal * interest);
                data.set(i, temp[0] + "," + temp[1] + "," + bal);
            }
            save();
            System.out.println("Interest applied to all accounts");
        }
    }

    static void save() {
        try {
            FileWriter fw = new FileWriter(FILE);
            for (Object acc : data) {
                fw.write(acc + "\n");
            }
            fw.close();
        } catch (Exception e) {
            System.out.println("Error saving file");
        }
    }

    static void load() {
        try {
            File f = new File(FILE);
            if (f.exists()) {
                BufferedReader br = new BufferedReader(new FileReader(f));
                String line;
                while ((line = br.readLine()) != null) {
                    data.add(line);
                }
                br.close();
            }
        } catch (Exception e) {
            System.out.println("Error loading file");
        }
    }
}
