# python src/task_manager.py


x = []
temp = "tasks.txt"
DEBUG = True

def do_stuff(d):
    global x
    if d == "1":
        t = input("Enter task: ")
        p = input("Priority (h/m/l): ")
        dt = input("Due date: ")
        data = f"{t}|{p}|{dt}"
        x.append(data)
        save()
        if DEBUG == True:
            print("Debug: Task added")
    elif d=="2":
        if len(x) > 0:
            for i in range(len(x)):
                temp = x[i].split("|")
                print(f"{i+1}. {temp[0]} (Priority: {temp[1]}, Due: {temp[2]})")
        else:
            print("no tasks")
    elif d=="3":
        if len(x) > 0:
            try:
                i = int(input("Enter task number to delete: ")) - 1
                x.pop(i)
                save()
                print("deleted")
            except:
                print("invalid input")
    elif d=="4":
        if len(x) > 0:
            i = int(input("Enter task number to edit: ")) - 1
            t = input("New task description (press enter to skip): ")
            p = input("New priority (h/m/l) (press enter to skip): ")
            dt = input("New due date (press enter to skip): ")
            temp = x[i].split("|")
            if t: temp[0] = t
            if p: temp[1] = p
            if dt: temp[2] = dt
            x[i] = "|".join(temp)
            save()
            print("updated")
        else:
            print("no tasks")
    elif d=="5":
        h_tasks = []
        m_tasks = []
        l_tasks = []
        for t in x:
            data = t.split("|")
            if data[1] == "h":
                h_tasks.append(t)
            elif data[1] == "m":
                m_tasks.append(t)
            else:
                l_tasks.append(t)
        print("High Priority Tasks:")
        for t in h_tasks:
            temp = t.split("|")
            print(f"- {temp[0]} (Due: {temp[2]})")
        print("\nMedium Priority Tasks:")
        for t in m_tasks:
            temp = t.split("|")
            print(f"- {temp[0]} (Due: {temp[2]})")
        print("\nLow Priority Tasks:")
        for t in l_tasks:
            temp = t.split("|")
            print(f"- {temp[0]} (Due: {temp[2]})")

def save():
    global x, temp
    f = open(temp, "w")
    for t in x:
        f.write(t + "\n")
    f.close()

def load():
    global x, temp
    try:
        f = open(temp, "r")
        x = [line.strip() for line in f.readlines()]
        f.close()
    except:
        x = []

def main():
    load()
    while True:
        print("\n1. Add Task")
        print("2. List Tasks")
        print("3. Delete Task")
        print("4. Edit Task")
        print("5. View by Priority")
        print("6. Exit")
        d = input("Choose option: ")
        if d == "6":
            break
        do_stuff(d)

if __name__ == "__main__":
    main()
